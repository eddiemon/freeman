import autobind from "autobind-decorator";
import os from "os";
import * as PropTypes from "prop-types";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import SplitPane from "react-split-pane";

import { CommandPalette } from "components/modals";
import { DirectoryWrapper, Status } from "components/panels";
import { IAppContext, IStatusNotifier } from "models";
import { ApplicationCommander } from "objects";
import { IAppProps } from "props";
import { IAppState } from "states";
import { DirectoryPaneSide, StatusUpdate } from "types";

import "styles/App.scss";

/** The main application component. */
class App extends React.Component<IAppProps, IAppState> {

    /** Validation for child context types. */
    public static childContextTypes = {
        theme: PropTypes.object
    };

    /** Handler functions for the given events this component handles. */
    private handlers = {
        switchPane: this.switchPane,
        openCommandPalette: this.openCommandPalette
    };

    /** Notifies the status component of current application state. */
    private statusNotifier: IStatusNotifier;

    /** A timer used for the status message. */
    private statusMessageTimeout: NodeJS.Timer;

    /**
     * Defines how the main app component is rendered.
     *
     * @param - the props for the component
     *
     * @returns - a JSX element representing the app view
     */
    constructor(props: IAppProps) {
        super(props);

        this.statusNotifier = {
            notify: (payload: string) => this.updateStatus("notification", payload),
            setItemCount: (payload: number) => this.updateStatus("itemCount", payload),
            setChosenCount: (payload: number) => this.updateStatus("chosenCount", payload)
        };

        this.state = {
            selectedPane: "left",
            isCommandPaletteOpen: false,
            status: {
                message: "",
                itemCount: 0,
                chosenCount: 0
            }
        };
    }

    /** Returns the child context to pass down the component tree. */
    public getChildContext(): IAppContext {
        return { theme: this.props.themeManager.theme };
    }

    /**
     * Defines how the main application component is rendered
     *
     * @returns - a JSX element representing the main application view
     */
    public render(): JSX.Element {
        const appStyle = { color: this.props.themeManager.theme.primaryColour };
        const splitPaneStyle = { height: "97vh" };

        return <div>
            <HotKeys keyMap={this.props.keysManager.keyMap || undefined} handlers={this.handlers}>
                <div className="App" style={appStyle}>
                    <SplitPane
                        split="vertical"
                        defaultSize="50vw"
                        style={splitPaneStyle}>
                        <DirectoryWrapper
                            id="left"
                            initialPath={os.homedir()}
                            isSelectedPane={this.state.selectedPane === "left"}
                            sendSelectedPaneUp={this.selectPane}
                            directoryManager={this.props.directoryManager}
                            statusNotifier={this.statusNotifier} />
                        <DirectoryWrapper
                            id="right"
                            initialPath={os.homedir()}
                            isSelectedPane={this.state.selectedPane === "right"}
                            sendSelectedPaneUp={this.selectPane}
                            directoryManager={this.props.directoryManager}
                            statusNotifier={this.statusNotifier} />
                    </SplitPane>
                    <Status {...this.state.status} />
                </div>
            </HotKeys>
            <CommandPalette
                isOpen={this.state.isCommandPaletteOpen}
                onClose={this.closeCommandPalette}
                applicationCommands={ApplicationCommander.commands} />
        </div>;
    }

    /** Handles closing the quick select modal, if not already closed. */
    @autobind
    private closeCommandPalette() {
        if (this.state.isCommandPaletteOpen) {
            this.setState({ isCommandPaletteOpen: false } as IAppState);
        }
    }

    /** Handles opening the quick select modal, if not already open. */
    @autobind
    private openCommandPalette() {
        if (!this.state.isCommandPaletteOpen) {
            this.setState({ isCommandPaletteOpen: true } as IAppState);
        }
    }

    /** Handles updating the status component's message. */
    @autobind
    private updateStatus(updateType: StatusUpdate, payload: string | number) {
        const status = this.state.status;
        const statusTimeout = 2000;

        if (updateType === "itemCount") {
            status.itemCount = payload as number;
        } else if (updateType === "chosenCount") {
            status.chosenCount = payload as number;
        } else {
            status.message = payload as string;
            clearTimeout(this.statusMessageTimeout);
            this.statusMessageTimeout = setTimeout(() => {
                status.message = "";
                this.setState({ status } as IAppState);
            }, statusTimeout);
        }

        this.setState({ status } as IAppState);
    }

    /** Handles switching selected pane. */
    @autobind
    private switchPane() {
        const { selectedPane } = this.state;

        if (selectedPane === "left") {
            this.setState({ selectedPane: "right" } as IAppState);
        } else {
            this.setState({ selectedPane: "left" } as IAppState);
        }
    }

    /**
     * Handles selecting the given pane.
     *
     * @param paneToSelect - the pane to select, if not currently selected
     */
    @autobind
    private selectPane(paneToSelect: DirectoryPaneSide) {
        if (paneToSelect !== this.state.selectedPane) {
            this.setState({ selectedPane: paneToSelect } as IAppState);
        }
    }
}

export default App;
