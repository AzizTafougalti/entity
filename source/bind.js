import { typeOf } from './addons/helperFunctions'

function getDiff(original, eddited, diff, path = "") {
    if (typeOf(original) == typeOf(eddited)) {
        switch (typeOf(original)) {
            case "object": {
                let origKeys = Object.keys(original),
                    eddiKeys = Object.keys(eddited),
                    index = undefined

                for (let key of origKeys) {
                    index = eddiKeys.indexOf(key)
                    if (index > -1) {
                        eddiKeys.splice(index, 1)
                        getDiff(original[key], eddited[key], diff, path + key + '.')
                    }
                    else {
                        diff[path + key] = { value: undefined, action: 'unset' }
                    }
                }
                for (let key of eddiKeys) {
                    diff[path + key] = { value: eddited[key], action: 'set' }
                }
                break
            }
            case "array": {
                let origLength = original.length,
                    eddiLength = eddited.length

                if (origLength > eddiLength) {
                    diff[path.slice(0, -1)] = { value: eddiLength, action: 'pull' }
                }
                else if (origLength < eddiLength) {
                    diff[path.slice(0, -1)] = { value: eddited.slice(origLength), action: 'push' }
                    eddiLength = origLength
                }

                for (let i = 0; i < eddiLength; i++) {
                    getDiff(original[i], eddited[i], diff, path + i + '.')
                }
                break
            }
            default: {
                if (original != eddited) {
                    diff[path.slice(0, -1)] = { value: eddited, action: 'set' }
                }
            }
        }
    }
    else diff[path.slice(0, -1)] = { value: eddited, action: 'set' }
}

export default function bind(object, state, type, diff, path = "") {
    for (let key in state) {
        if (typeof type[key] !== 'undefined') {
            switch (typeof type[key]) {
                case 'object': {
                    bind(object[key], state[key], type[key], diff, path + key + ".")
                    break
                }
                case 'function': {
                    switch (type[key].name) {
                        case 'Array': {
                            if (diff)
                                getDiff(object[key], state[key], diff, path + key + ".")
                            object[key] = new type[key]()
                            object[key].push(...state[key])
                            object[key] = object[key].valueOf()
                            break
                        }
                        case 'Object': {
                            if (diff)
                                getDiff(object[key], state[key], diff, path + key + ".")
                            object[key] = new type[key](state[key])
                            break
                        }
                        default: {
                            if (object[key] != state[key]) {
                                if (diff)
                                    diff[path + key] = { value: state[key], action: 'set' }
                                object[key] = new type[key](state[key]).valueOf()
                            }
                        }
                    }
                    break
                }
            }
        }
    }
}