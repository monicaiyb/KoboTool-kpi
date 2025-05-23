import { useOrganizationQuery } from '#/account/organization/organizationQuery'
import BillingButton from '#/account/plans/billingButton.component'
import { postCustomerPortal } from '#/account/stripe.api'
import type { Price, SinglePricedProduct } from '#/account/stripe.types'
import { processCheckoutResponse } from '#/account/stripe.utils'

interface PlanButtonProps {
  buySubscription: (price: Price, quantity?: number) => void
  downgrading: boolean
  isBusy: boolean
  isSubscribedToPlan: boolean
  showManage: boolean
  product: SinglePricedProduct
  quantity: number
  setIsBusy: (value: boolean) => void
}

/**
 * A button that's used to start checkout for a Plan at Stripe.
 * Plans need extra logic that add-ons don't, mostly to display the correct label text.
 */
export const PlanButton = ({
  product,
  downgrading,
  isBusy,
  setIsBusy,
  buySubscription,
  showManage,
  quantity,
  isSubscribedToPlan,
}: PlanButtonProps) => {
  const orgQuery = useOrganizationQuery()

  if (!product || !orgQuery.data || product.price.unit_amount === 0) {
    return null
  }

  const manageSubscription = (subscriptionPrice?: Price) => {
    setIsBusy(true)
    postCustomerPortal(orgQuery.data.id, subscriptionPrice?.id, quantity)
      .then(processCheckoutResponse)
      .catch(() => setIsBusy(false))
  }

  if (!isSubscribedToPlan && !showManage && !downgrading) {
    return (
      <BillingButton
        label={t('Upgrade')}
        onClick={() => buySubscription(product.price, quantity)}
        aria-label={`upgrade to ${product.name}`}
        isDisabled={isBusy}
      />
    )
  }

  if (showManage || isSubscribedToPlan) {
    return (
      <BillingButton
        label={t('Manage')}
        onClick={manageSubscription}
        aria-label={`manage your ${product.name} subscription`}
        isDisabled={isBusy}
      />
    )
  }

  return (
    <BillingButton
      label={t('Change plan')}
      onClick={() => buySubscription(product.price, quantity)}
      aria-label={`change your subscription to ${product.name}`}
      isDisabled={isBusy}
    />
  )
}
