'use babel';

import fs from 'fs'
import _ from 'underscore'
import {
    ScrollView
} from 'atom-space-pen-views'

export default class RightMenuManagerView extends ScrollView {
    static content() {
        this.raw(`
            <div class="right-menu-manager">
                <div class="search-bar">
                    <span>Search:</span>
                    <input type="text" name="" value="">
                </div>
                <div class="search-result">

                </div>
                <div class="test">

                </div>
            </div>
        `)
    }

    initialize(item, option) {
        super.initialize()
        var menuSets = atom.contextMenu.itemSets
        this.createResDom(_.chain(menuSets)
            .pluck('items')
            .flatten()
            .filter((it) => {
                return !!it.label
            })
            .value())


        this.on('click', (e) => {
            console.log(e)
        })
    }

    createResDom(resArr) {
        console.log(resArr)
        var resStr = resArr.map(function(it) {
            return `<div class="label">
                <div class="left">
                    ${it.label}
                </div>
                <div class="center">
                    ${it.command}
                </div>
                <div class="right">
                    <button type="button" name="button">隐藏</button>
                </div>
            </div>`
        }).join('')

        this.find('.search-result').html(resStr)
    }

    // events: {
    //     inputHandler() {}
    // }

    getTitle() {
        return 'Right-Menu-Manager'
    }
}
