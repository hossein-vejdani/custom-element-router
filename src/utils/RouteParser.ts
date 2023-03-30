import { Param } from '../models/Param'
import { Match, MatchFunction, MatchOptions, ParserKey, ParserLexToken, ParserToken, Path } from '../models/RouteParser'

export class RouteParser {
    private cache = new Map<string, MatchFunction>()

    match(str: Path, options?: MatchOptions) {
        if (this.cache.has(str)) return this.cache.get(str)
        const keys: ParserKey[] = []
        const re = this.pathToRegexp(str, keys, options)
        const result = this.regexpToFunction(re, keys, options)
        if (!str.includes('/:')) this.cache.set(str, result)
        return result
    }

    private queryParser(url: string): Param {
        const queryPart = url.split('?')
        if (!queryPart || queryPart.length < 2) return {}
        const queries = queryPart[1].split('&')
        const data: Param = {}
        queries.forEach(i => {
            const q = i.split('=')
            data[q[0]] = q[1]
        })
        return data
    }

    private pathToRegexp(path: Path, keys?: ParserKey[], options?: MatchOptions) {
        return this.stringToRegexp(path, keys, options)
    }

    private regexpToFunction(re: RegExp, keys: ParserKey[], options: MatchOptions = {}): MatchFunction {
        const { decode = (x: string) => x } = options
        return (routePath: string): Match => {
            const [pathWithoutQuery] = routePath.split('?')

            const m = re.exec(pathWithoutQuery)
            if (!m) return false

            const { 0: path, index } = m
            const params = Object.create(null)

            for (let i = 1; i < m.length; i++) {
                if (m[i] === undefined) continue

                const key = keys[i - 1]

                if (key.modifier === '*' || key.modifier === '+') {
                    params[key.name] = m[i].split(key.prefix + key.suffix).map(value => {
                        return decode(value, key)
                    })
                } else {
                    params[key.name] = decode(m[i], key)
                }
            }
            const queryParams = this.queryParser(routePath)

            return { path, index, params, queryParams }
        }
    }

    private regexpToRegexp(path: RegExp, keys?: ParserKey[]): RegExp {
        if (!keys) return path

        const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g

        let index = 0
        let execResult = groupsRegex.exec(path.source)
        while (execResult) {
            keys.push({
                name: execResult[1] || index++,
                prefix: '',
                suffix: '',
                modifier: '',
                pattern: ''
            })
            execResult = groupsRegex.exec(path.source)
        }

        return path
    }

    private stringToRegexp(path: string, keys?: ParserKey[], options?: MatchOptions) {
        return this.tokensToRegexp(this.parse(path, options), keys, options)
    }

    private flags(options?: { sensitive?: boolean }) {
        return options && options.sensitive ? '' : 'i'
    }

    private tokensToRegexp(tokens: ParserToken[], keys?: ParserKey[], options: MatchOptions = {}) {
        const { strict = false, start = true, end = true, encode = (x: string) => x, delimiter = '/#?', endsWith = '' } = options
        const endsWithRe = `[${this.escapeString(endsWith)}]|$`
        const delimiterRe = `[${this.escapeString(delimiter)}]`
        let route = start ? '^' : ''

        // Iterate over the tokens and create our regexp string.
        for (const token of tokens) {
            if (typeof token === 'string') {
                route += this.escapeString(encode(token))
            } else {
                const prefix = this.escapeString(encode(token.prefix))
                const suffix = this.escapeString(encode(token.suffix))

                if (token.pattern) {
                    if (keys) keys.push(token)

                    if (prefix || suffix) {
                        if (token.modifier === '+' || token.modifier === '*') {
                            const mod = token.modifier === '*' ? '?' : ''
                            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`
                        } else {
                            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`
                        }
                    } else {
                        if (token.modifier === '+' || token.modifier === '*') {
                            route += `((?:${token.pattern})${token.modifier})`
                        } else {
                            route += `(${token.pattern})${token.modifier}`
                        }
                    }
                } else {
                    route += `(?:${prefix}${suffix})${token.modifier}`
                }
            }
        }

        if (end) {
            if (!strict) route += `${delimiterRe}?`

            route += !options.endsWith ? '$' : `(?=${endsWithRe})`
        } else {
            const endToken = tokens[tokens.length - 1]
            const isEndDelimited = typeof endToken === 'string' ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined

            if (!strict) {
                route += `(?:${delimiterRe}(?=${endsWithRe}))?`
            }

            if (!isEndDelimited) {
                route += `(?=${delimiterRe}|${endsWithRe})`
            }
        }

        return new RegExp(route, this.flags(options))
    }
    private parse(str: string, options: MatchOptions = {}): ParserToken[] {
        const tokens = this.lexer(str)
        const { prefixes = './' } = options
        const defaultPattern = `[^${this.escapeString(options.delimiter || '/#?')}]+?`
        const result: ParserToken[] = []
        let key = 0
        let i = 0
        let path = ''

        const tryConsume = (type: ParserLexToken['type']): string | undefined => {
            if (i < tokens.length && tokens[i].type === type) return tokens[i++].value
        }

        const mustConsume = (type: ParserLexToken['type']): string => {
            const value = tryConsume(type)
            if (value !== undefined) return value
            const { type: nextType, index } = tokens[i]
            throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`)
        }

        const consumeText = (): string => {
            let result = ''
            let value: string | undefined
            while ((value = tryConsume('CHAR') || tryConsume('ESCAPED_CHAR'))) {
                result += value
            }
            return result
        }

        while (i < tokens.length) {
            const char = tryConsume('CHAR')
            const name = tryConsume('NAME')
            const pattern = tryConsume('PATTERN')

            if (name || pattern) {
                let prefix = char || ''

                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix
                    prefix = ''
                }

                if (path) {
                    result.push(path)
                    path = ''
                }

                result.push({
                    name: name || key++,
                    prefix,
                    suffix: '',
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume('MODIFIER') || ''
                })
                continue
            }

            const value = char || tryConsume('ESCAPED_CHAR')
            if (value) {
                path += value
                continue
            }

            if (path) {
                result.push(path)
                path = ''
            }

            const open = tryConsume('OPEN')
            if (open) {
                const prefix = consumeText()
                const name = tryConsume('NAME') || ''
                const pattern = tryConsume('PATTERN') || ''
                const suffix = consumeText()

                mustConsume('CLOSE')

                result.push({
                    name: name || (pattern ? key++ : ''),
                    pattern: name && !pattern ? defaultPattern : pattern,
                    prefix,
                    suffix,
                    modifier: tryConsume('MODIFIER') || ''
                })
                continue
            }

            mustConsume('END')
        }

        return result
    }

    private escapeString(str: string) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
    }

    private lexer(str: string): ParserLexToken[] {
        const tokens: ParserLexToken[] = []
        let i = 0

        while (i < str.length) {
            const char = str[i]

            if (char === '*' || char === '+' || char === '?') {
                tokens.push({ type: 'MODIFIER', index: i, value: str[i++] })
                continue
            }

            if (char === '\\') {
                tokens.push({ type: 'ESCAPED_CHAR', index: i++, value: str[i++] })
                continue
            }

            if (char === '{') {
                tokens.push({ type: 'OPEN', index: i, value: str[i++] })
                continue
            }

            if (char === '}') {
                tokens.push({ type: 'CLOSE', index: i, value: str[i++] })
                continue
            }

            if (char === ':') {
                let name = ''
                let j = i + 1

                while (j < str.length) {
                    const code = str.charCodeAt(j)

                    if (
                        // `0-9`
                        (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95
                    ) {
                        name += str[j++]
                        continue
                    }

                    break
                }

                if (!name) throw new TypeError(`Missing parameter name at ${i}`)

                tokens.push({ type: 'NAME', index: i, value: name })
                i = j
                continue
            }

            if (char === '(') {
                let count = 1
                let pattern = ''
                let j = i + 1

                if (str[j] === '?') {
                    throw new TypeError(`Pattern cannot start with "?" at ${j}`)
                }

                while (j < str.length) {
                    if (str[j] === '\\') {
                        pattern += str[j++] + str[j++]
                        continue
                    }

                    if (str[j] === ')') {
                        count--
                        if (count === 0) {
                            j++
                            break
                        }
                    } else if (str[j] === '(') {
                        count++
                        if (str[j + 1] !== '?') {
                            throw new TypeError(`Capturing groups are not allowed at ${j}`)
                        }
                    }

                    pattern += str[j++]
                }

                if (count) throw new TypeError(`Unbalanced pattern at ${i}`)
                if (!pattern) throw new TypeError(`Missing pattern at ${i}`)

                tokens.push({ type: 'PATTERN', index: i, value: pattern })
                i = j
                continue
            }

            tokens.push({ type: 'CHAR', index: i, value: str[i++] })
        }

        tokens.push({ type: 'END', index: i, value: '' })

        return tokens
    }
}
