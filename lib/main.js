'use babel';

import RightMenuManagerView from './right-menu-manager-view';
import { init } from './menu-item-manager';
import {
    CompositeDisposable
} from 'atom';
import _ from 'underscore'

const menuSets = atom.contextMenu.itemSets

const pckageURI = 'atom://right-menu-manager'

export default {

    rightMenuManagerView: null,
    subscriptions: null,

    activate(state) {
        let self = this

        init()

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.workspace.addOpener((uri) => {
            if (uri === pckageURI) {
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
        atom.workspace.open(pckageURI)
        console.log('RightMenuManager was toggled!');
    }

};
