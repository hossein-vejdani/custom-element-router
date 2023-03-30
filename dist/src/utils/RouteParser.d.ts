import { MatchFunction, MatchOptions, Path } from '../models/RouteParser';
export declare class RouteParser {
    private cache;
    match(str: Path, options?: MatchOptions): MatchFunction | undefined;
    private queryParser;
    private pathToRegexp;
    private regexpToFunction;
    private regexpToRegexp;
    private stringToRegexp;
    private flags;
    private tokensToRegexp;
    private parse;
    private escapeString;
    private lexer;
}
