export default class validate {
    static length(content = '', min = 0, max = 999999) {
        if (content.length < min || content.length > max) return false
        return true
    }

    static emptyString(content = '') {
        if (content.trim() == '') return false
        return true
    }

    static phoneNumber(content = '') {
        const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
        return content.match(regexPhoneNumber) ? true : false
    }

    static email(content = '') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(content)
    }
}