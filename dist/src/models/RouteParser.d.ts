import { Param } from './Param';
export type Path = string;
export type MatchFunction = (path: string) => Match;
export type Match = false | MatchResult;
export type ParserToken = string | ParserKey;
export type ParserLexToken = {
    type: 'OPEN' | 'CLOSE' | 'PATTERN' | 'NAME' | 'CHAR' | 'ESCAPED_CHAR' | 'MODIFIER' | 'END';
    index: number;
    value: string;
};
export type MatchResult = {
    path: string;
    index: number;
    params: Param;
    queryParams?: Param;
};
export type ParserKey = {
    name: string | number;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
};
export type MatchOptions = {
    prefixes?: string;
    decode?: (value: string, token: ParserKey) => string;
    sensitive?: boolean;
    strict?: boolean;
    start?: boolean;
    end?: boolean;
    encode?: (value: string) => string;
    delimiter?: string;
    endsWith?: string;
};
