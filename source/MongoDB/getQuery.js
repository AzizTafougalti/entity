function assign(object, key, subKey, value) {
    if (object[key]) object[key][subKey] = value
    else object[key] = { [subKey]: value }
}

function getQuery(diff) {
    let result = {}
    for (let key in diff) {
        switch (diff[key].action) {
            case 'set': {
                assign(result, '$set', key, diff[key].value)
                break
            }
            case 'unset': {
                assign(result, '$unset', key, '')
                break
            }
            case 'push': {
                assign(result, '$push', key, { $each: diff[key].value })
                break
            }
            case 'pull': {
                assign(result, '$push', key, { $each: [], $slice: diff[key].value })
                break
            }
        }
    }
    return result
}

function getPayload(diff) {
    for (let result = [], reduced = {}; true; diff = reduced, reduced = {}) {
        for (let child in diff) {
            for (let parent in diff) {
                if (child != parent && child.startsWith(parent)) {
                    reduced[parent] = diff[parent]
                    delete diff[parent]
                }
            }
        }
        result.push(getQuery(diff))
        switch (Object.keys(reduced).length) {
            case 0: {
                return result
            }
            case 1: {
                result.push(getQuery(reduced))
                return result
            }
        }
    }
}

export default function (diff) {
    if (Object.keys(diff).length) return getPayload(diff)
    return []
}