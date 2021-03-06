import { injectable } from "inversify";
import * as pty from "node-pty";
import { ITerminal, ProcessEnv } from "node-pty/lib/interfaces";
import os from "os";

import LoggedError from "errors/LoggedError";
import { IShell } from "objects";

/** A thin facade of an underlying shell process of an integrated terminal. */
@injectable()
class Shell implements IShell {

    /** The underlying shell process. */
    private process?: ITerminal;

    /** @inheritDoc */
    public spawn(shellName: string) {
        this.process = pty.spawn(shellName, [], {
            cwd: os.homedir(),
            env: process.env as ProcessEnv
        });
    }

    /** @inheritDoc */
    public write(data: any) {
        this.process && this.process.write(data);
    }

    /** @inheritDoc */
    public resize(columns: number, rows: number) {
        this.process && this.process.resize(columns, rows);
    }

    /** @inheritDoc */
    public attach(xterm: Xterm) {
        if (!this.process) {
            throw new LoggedError("Could not write to shell process before spawning");
        }

        xterm.on("data", data => {
            this.process!.write(data);
        });

        this.process.on("data", data => {
            xterm.write(data);
        });
    }
}

export default Shell;
