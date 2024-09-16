import { isEmpty } from "../helperFun/helperFun"

const validateDecimal = (value) => /^\d+(\.\d+)?$/.test(value);


export const validateProducts = async (value) => {

    const { productName,
        description,
        productImage,
        OriginalPrice,
        DiscountPrice,
        Quantity,
        UOM,
        HSNCode, } = value

    let error = {}


    if (await isEmpty(productName)) {
        error.productName = 'ProductName Required'
    }
    if (isEmpty(description)) {
        error.description = 'Description Required'
    }
    if (productImage == '') {
        error.productImage = 'productImage Required'
    }
    if (isEmpty(OriginalPrice)) {
        error.OriginalPrice = 'OriginalPrice Required'
    }

    if (!validateDecimal(OriginalPrice)) {
        error.OriginalPrice = 'OriginalPrice Must be Number'
    }
    if (isEmpty(DiscountPrice)) {
        error.DiscountPrice = 'DiscountPrice Required'
    }
    if (!validateDecimal(DiscountPrice)) {
        error.DiscountPrice = 'DiscountPrice Must be Number'
    }
    if (isEmpty(Quantity)) {
        error.Quantity = 'Quantity Required'
    }
    if (!validateDecimal(Quantity)) {
        error.Quantity = 'Quantity Must be Number'
    }
    if (isEmpty(UOM)) {
        error.UOM = 'UOM Required'
    }
    if (isEmpty(HSNCode)) {
        error.HSNCode = 'HSNCode Required'
    }

    return error
}


export const CheckOutValidation = async (value) => {
    const { name,
        address,
        city,
        pincode,
        cashOnly } = value

    let error = {}


    if (await isEmpty(name)) {
        error.name = 'Name Required'
    }
    if (isEmpty(address)) {
        error.address = 'Address Required'
    }

    if (isEmpty(city)) {
        error.city = 'City Required'
    }
    if (isEmpty(pincode)) {
        error.pincode = 'Pincode Required'
    }
    if (!validateDecimal(pincode)) {
        error.pincode = 'Pincode Must be Number'
    }

    if (!cashOnly) {
        error.cashOnly = 'payment Required'
    }
    return error
}