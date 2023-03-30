declare class RouterLink extends HTMLElement {
    constructor();
}
export declare class RouterHashLink extends RouterLink {
    constructor();
    connectedCallback(): void;
}
export declare class RouterHistoryLink extends RouterLink {
    constructor();
    connectedCallback(): void;
}
export {};
