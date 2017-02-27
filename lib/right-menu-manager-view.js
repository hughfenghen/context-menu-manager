'use babel';

import _ from 'underscore'
import {
    $,
    ScrollView
} from 'atom-space-pen-views'
import {
    extMeuns,
    removeMenuItem,
    resetMenuItem,
    getHiddenMenus,
    getVisibleMenus
} from './menu-item-manager';

const menuSets = atom.contextMenu.itemSets

export default class RightMenuManagerView extends ScrollView {
    static content() {
        this.raw(`
            <div class="right-menu-manager">
                <div class="search-bar">
                    <span>Search:</span>
                    <input type="text" name="" value="">
                    <div>
                </div>
                <div class="visible-menus"></div>
                <div class="hidden-menus"></div>
            </div>
        `)
    }

    initialize(item, option) {
        super.initialize()
        // extMeuns()
        this.render()
        this.bind()
    }

    render() {
        this.find('.hidden-menus').empty().html(this.createMenuDom(getHiddenMenus(), false))
        this.find('.visible-menus').empty().html(this.createMenuDom(getVisibleMenus(), true))
    }

    createMenuDom(menus, isShow) {
        const [word, classNames] = isShow ?　['隐藏', 'hideBtn btn icon icon-playback-pause enablement'] : ['显示', 'showBtn btn icon enablement icon-playback-play']

        return menus.map(function(it) {
            return `<div class="menu-item" >
                <input class="data" type="hidden" value="${it._ext_selector}|||${it.label}|||${it.command}">
                <div class="left">
                    <div class="label">${it.label || it.type}</div>
                    <div>
                        <span>{selector: "${it._ext_selector}"</span>
                        <span>command: "${it.command || ''}"}</span>
                    </div>
                </div>
                <div class="center">
                </div>
                <div class="right">
                    <button class="${classNames}" type="button" name="button">${word}</button>
                </div>
            </div>`
        }).join('')
    }

    bind() {
        console.log(1111111111111, this.eventHandler)

        this.on('click', '.hideBtn', this.eventHandler.hideMenuItem)
        this.on('click', '.showBtn', this.eventHandler.showMenuItem)
    }


    get eventHandler() {
        const self = this
        return {
            hideMenuItem(e) {
                const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')

                removeMenuItem(selector, command)
                self.render()
            },
            showMenuItem(e) {
                const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')

                resetMenuItem(selector, command)
                self.render()
            }
        }
    }

    getTitle() {
        return 'Right-Menu-Manager'
    }
}
