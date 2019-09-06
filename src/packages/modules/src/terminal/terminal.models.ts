type LogLevel = "notice" | "warning" | "debug";

export interface TerminalLine {
    text: string;
    level: LogLevel;
}

export interface TerminalModel {
    lines: Array<TerminalLine>;
}

export interface TerminalModuleState {
    terminal: TerminalModel;
}
