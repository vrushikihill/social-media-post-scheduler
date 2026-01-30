// ** Toolkit imports
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// ** Reducers
import branch from 'src/store/branch/branch'
import category from 'src/store/category/category'
import customerFeedback from 'src/store/customer-feedback/customerFeedback'
import items from 'src/store/item/item'
import mediaLibrary from 'src/store/media-library/mediaLibrary'
import modal from 'src/store/modal'
import orders from 'src/store/order/orders'
import template from 'src/store/pdf-template/pdfTemplate'
import organization from 'src/store/organization/organization'
import pricingPlans from 'src/store/pricing-plans/pricingPlans'
import purchaseOrders from 'src/store/purchase/purchaseOrders'
import settings, { resetStore } from 'src/store/settings/user/user'
import trustedPeople from 'src/store/trusted-people/trustedPeople'
import vendor from 'src/store/vendor/vendor'
import vendorDocument from 'src/store/vendor/vendorDocument'
import warehouse from 'src/store/warehouse/warehouse'
import banner from 'src/store/web-info/banner'
import about from 'src/store/web-info/about'
import questions from 'src/store/web-info/faqs'
import feature from 'src/store/web-info/feature'
import socialMedia from 'src/store/web-info/socialMedia'
import contact from 'src/store/appManagement/contact'
import notification from 'src/store/appManagement/notification'
import aboutUs from 'src/store/appManagement/aboutUs'
import privacyPolicy from 'src/store/appManagement/privacyPolicy'
import deal from 'src/store/appManagement/deal'
import trialPricingPlans from 'src/store/trial-plans/trialPlans'
import subCategory from 'src/store/category/subCategory'
import blog from 'src/store/blog'
import requestDemoUser from 'src/store/request-demo-users/requestDemoUser'
import dashboard from 'src/store/dashboard/dashboard'

const combinedReducer = combineReducers({
  settings,
  organization,
  orders,
  items,
  branch,
  warehouse,
  category,
  purchaseOrders,
  mediaLibrary,
  pricingPlans,
  trialPricingPlans,
  customerFeedback,
  trustedPeople,
  vendor,
  vendorDocument,
  modal,
  banner,
  about,
  questions,
  feature,
  socialMedia,
  template,
  contact,
  aboutUs,
  privacyPolicy,
  notification,
  deal,
  subCategory,
  blog,
  requestDemoUser,
  dashboard
})

const rootReducer = (state, action) => {
  if (action.type === resetStore.type) {
    state = undefined
  }

  return combinedReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
