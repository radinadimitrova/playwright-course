import { expect } from "@playwright/test"

export class PaymentPage {
    constructor (page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        this.discountCodeInput = page.locator('[data-qa="discount-code-input"]')
        this.submitDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]') 
        this.creditCardOwnerInput = page.locator('[data-qa="credit-card-owner"]') 
        this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]') 
        this.creditCardValidUntilInput = page.locator('[data-qa="valid-until"]') 
        this.creditCardcCvcInput = page.locator('[data-qa="credit-card-cvc"]')
        this.payButton = page.locator('[data-qa="pay-button"]')    
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountCodeInput.waitFor()
        await this.discountCodeInput.fill(code)
        await expect(this.discountCodeInput).toHaveValue(code)

        //Option 2 for laggy inouts: slow typing
        // await this.discountCodeInput.focus()
        // await this.page.keyboard.type(code, {delay: 1000});
        // expect(await this.discountCodeInput.inputValue()).toBe(code)
        // await this.page.pause()

        expect(await this.discountedValue.isVisible()).toBe(false)
        expect(await this.discountActiveMessage.isVisible()).toBe(false)
        await this.submitDiscountButton.waitFor()
        await this.submitDiscountButton.click()
        await this.discountActiveMessage.waitFor()
        await expect(this.discountActiveMessage).toBeVisible()

        await this.discountedValue.waitFor()
        const discountValueText = await this.discountedValue.innerText()
        const discountValueOnlyStringNumber = discountValueText.replace("$", "")
        const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10)

        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText()
        const totalValueOnlyStringNumber = totalValueText.replace("$", "")
        const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10)

        expect(discountValueNumber).toBeLessThan(totalValueNumber)
    }

    fillPaymentDetails = async (paymentDetails) => {
       await this.creditCardOwnerInput.waitFor()
       await this.creditCardOwnerInput.fill(paymentDetails.owner)
       await this.creditCardNumberInput.waitFor()
       await this.creditCardNumberInput.fill(paymentDetails.number)
       await this.creditCardValidUntilInput.waitFor()
       await this.creditCardValidUntilInput.fill(paymentDetails.validUntil)
       await this.creditCardcCvcInput.waitFor()
       await this.creditCardcCvcInput.fill(paymentDetails.cvc)
    }

    successfullPayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, {timeout: 3000})
    }
}