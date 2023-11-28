export default class func {
    static convertDate(date) {
        let fDate = new Date(date)
        return fDate.toLocaleString()
    }

    static convertVND(price) {
        if (price != null && price != undefined && price != '') return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
        else return 0
    }

    static removeElementByValue(array, element) {
        let index = array.indexOf(element)
        if (index > -1) {
            array.splice(index, 1)
        }
    }

    static cloneArray(data) {
        return [...data]
    }

    static cloneObject(data) {
        return { ...data }
    }

    static isValidCoordinates(latitude, longitude) {
        return (
            !isNaN(parseFloat(latitude)) &&
            !isNaN(parseFloat(longitude)) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        )
    }
}