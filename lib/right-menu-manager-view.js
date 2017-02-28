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
    getVisibleMenus,
    findMenuItemShortcut
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
                <h3 class="heading">显示的菜单</h3>
                <div class="visible-menus"></div>
                <h3 class="heading">隐藏的菜单</h3>
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

        return menus.map(function(it, idx) {
            return `<div class="menu-item" >
                <input class="data" type="hidden" value="${it._ext_selector}|||${it.label}|||${it.command}">
                <div class="left">
                    <div class="label">
                        <span>${it.label || it.type}</span>
                        <span class="keystrokes"></span>
                    </div>
                    <div>
                        <span>{selector: "${it._ext_selector}"</span>
                        <span>command: "${it.command || ''}"}</span>
                    </div>
                </div>
                <div class="right">
                    <input id="shortcut-${idx}" class="shortcut" type="checkbox">
                    <label for="shortcut-${idx}">附件快捷键</label>
                    <button class="${classNames}" type="button" name="button">${word}</button>
                </div>
            </div>`
        }).join('')
    }

    bind() {
        this.on('click', '.hideBtn', this.eventHandler.hideMenuItem)
        this.on('click', '.showBtn', this.eventHandler.showMenuItem)
        this.on('click', '.heading', this.eventHandler.foldMenus)
        this.on('click', '.shortcut', this.eventHandler.shortcutChange)
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
            },
            foldMenus(e) {
                $(e.target).next().toggle()
            },
            shortcutChange(e) {
                const $keystrokes = $(e.target).parent().siblings('.left').find('.keystrokes')
                if (!e.target.checked) {
                    $keystrokes.text('')
                    return
                }

                const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')

                const key = findMenuItemShortcut(command)
                console.log(key, $keystrokes.text())

                if (key) {
                    $keystrokes.text(`(${key})`)
                }
            }
        }
    }

    getTitle() {
        return 'Right-Menu-Manager'
    }
}
