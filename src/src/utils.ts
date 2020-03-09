interface parseClassesConfig {
    [key:string]:boolean
}


export function registerShortcut(key:string, todo:Function) {
    try {
        const shortcut = new window.nw.Shortcut({
            key: key,
            failed: (err:any) => {
                const value = localStorage.getItem('shortcut')

                value?.toLowerCase() !== key.toLowerCase() && alert(`Shortcut Failure(${err})`)
            }
        })

        window.nw.App.registerGlobalHotKey(shortcut)
        shortcut.on('active', todo)
    } catch(err) { alert(`Shortcut Failure(${err})`) }
}


export function storeObjectLocally(object:{}) {
    Object.entries(object)
          .forEach(([key, value]) => localStorage.setItem(key, String(value)))
}


export function parseClasses(toParse:parseClassesConfig = {},
                             defaultStr:string = '',
                            ):string {

    const parsed = Object.entries(toParse)
                         .map(([className, enabled]) => enabled ? className : '')
                         .join(' ')

    return `${defaultStr}${!defaultStr || defaultStr.endsWith(' ') ? '' : ' '}${parsed}`
}


export function randomize(token:number,
                          from:number = 1,
                          to:number =  Math.pow(10, 10)
                         ):string {

    return Math.floor(((Math.random() * to) + from) * token).toString()
}


export function entitle(untitled:string):string {
    return (untitled && `${untitled.charAt(0).toUpperCase()}${untitled.substr(1).toLowerCase()}`)
}


export function getWindow():any {
    const nw = window.nw

    return nw
        ? nw.Window.get()
        : {minimize: () => {},
           hide: () => {},
           show: () => {},
           focus: () => {}}
}


export function getTray(options:any):any {
    const nw = window.nw

    return nw
        ? nw.Tray(options)
        : {on: () => {}}
}