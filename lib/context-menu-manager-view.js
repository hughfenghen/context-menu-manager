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
    toggleMenuLabel,
    extraStrokesCfg
} from './menu-item-manager';

const menuSets = atom.contextMenu.itemSets

export default class ContextMenuManagerView extends ScrollView {
    static content() {
        this.raw(`
            <div class="context-menu-manager native-key-bindings">
                <div class="search-bar">
                    <input type="text" name="" value="" placeholder="Filter menus by label, command, selector.">
                </div>
                <h3 class="heading">Visible Menus</h3>
                <div class="visible-menus"></div>
                <h3 class="heading">Hidden Menus</h3>
                <div class="hidden-menus"></div>
            </div>
        `)
    }

    initialize(item, option) {
        super.initialize()

        this.render()
        this.bind()
    }

    render() {
        this.find('.hidden-menus').empty().html(this.createMenuDom(getHiddenMenus(), false))
        this.find('.visible-menus').empty().html(this.createMenuDom(getVisibleMenus(), true))
    }

    createMenuDom(menus, isShow) {
        const [word, classNames] = isShow ?　['Hide', 'hideBtn btn icon icon-playback-pause enablement'] : ['Show', 'showBtn btn icon enablement icon-playback-play']

        return menus.map(function(it, idx) {
            const uid = _.uniqueId()
            return `<div class="menu-item" >
                <input class="data" type="hidden" value="${it._ext_selector}|||${it.label}|||${it.command}">
                <div class="left">
                    <div class="label">
                        <span>${it.label || it.type}</span>
                    </div>
                    <div>
                        <span>{selector: "${it._ext_selector}"</span>
                        <span>command: "${it.command || ''}"}</span>
                    </div>
                </div>
                <div class="right">
                    <input id="shortcut-${uid}" class="shortcut" type="checkbox" ${extraStrokesCfg.has(it.command) ? 'checked' : ''}>
                    <label for="shortcut-${uid}">Show strokes</label>
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
        this.on('input', '.search-bar input', this.eventHandler.search)
    }

    get eventHandler() {
        const self = this
        return {
            hideMenuItem(e) {
                const mi = $(e.target).parents('.menu-item')
                const [selector, label, command] = mi.find('.data').val().split('|||')

                removeMenuItem(selector, command)
                mi.find('.right button').text('Show').removeClass('hideBtn').addClass('showBtn')
                self.find('.hidden-menus').prepend(mi)
            },
            showMenuItem(e) {
                const mi = $(e.target).parents('.menu-item')
                const [selector, label, command] = mi.find('.data').val().split('|||')

                resetMenuItem(selector, command)
                mi.find('.right button').text('Hide').removeClass('showBtn').addClass('hideBtn')
                self.find('.visible-menus').append(mi)
            },
            foldMenus(e) {
                $(e.target).toggleClass('collapsed').next().toggle()
            },
            shortcutChange(e) {
                const $label = $(e.target).parent().siblings('.left').find('.label')
                const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')

                $label.text(toggleMenuLabel(selector, command, e.target.checked))
            },
            search: _.debounce((e) => {
                const inputVal = $(e.target).val().trim()
                const mis = self.find('.menu-item')

                if (!inputVal || inputVal === '.') {
                    mis.show()
                }

                mis.each((idx, it) => {
                    const $it = $(it)
                    if (
                        $it.children('.data').val().split('|||').some((v) => {
                            return v.search(new RegExp(inputVal, 'i')) !== -1
                        })
                    ) {
                        $it.show()
                    } else {
                        $it.hide()
                    }
                })
            }, 500)
        }
    }

    getTitle() {
        return 'Context-Menu-Manager'
    }
}
