'use babel';

import RightMenuManagerView from './right-menu-manager-view';
import {
    CompositeDisposable
} from 'atom';

let RightMenuManagerURI = 'atom://right-menu-manager'

export default {

    rightMenuManagerView: null,
    subscriptions: null,

    activate(state) {
        let self = this
        // this.rightMenuManagerView = new RightMenuManagerView(state.rightMenuManagerViewState);

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.workspace.addOpener((uri) => {
                if (uri === RightMenuManagerURI) {
                    self.rightMenuManagerView = new RightMenuManagerView({
                        uri
                    })
                    return self.rightMenuManagerView
                }
            }))
            // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'right-menu-manager:toggle': () => this.toggle()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    toggle() {
        atom.workspace.open(RightMenuManagerURI)
        console.log('RightMenuManager was toggled!');
    }

};
