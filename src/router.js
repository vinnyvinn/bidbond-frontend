import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/Home.vue'),
            meta: {
                title: 'JBid'
            }
        },
        {
            path: '/verify/email/:code',
            name: 'verify-email',
            component: () => import('./views/Auth/VerifyEmail.vue'),
            meta: {
                title: 'Verify Email',
            }
        },
        {
            path: '/company/verify/:code',
            name: 'verify-company',
            component: () => import('./views/Auth/verifyCompany.vue'),
            meta: {
                title: 'JBid Verify Company',
            }
        },
        {
            path: '/reset/password/:code',
            name: 'reset-password',
            component: () => import('./views/Auth/ResetPassword.vue'),
            meta: {
                title: 'JBid Reset Password',
            }
        },
        {
            path: '/verify/personal',
            name: 'verify.personal',
            component: () => import('./views/Auth/VerifyPersonal.vue'),
            meta: {
                title: 'JBid Verify Personal',
            }
        },
        {
            path: '/verify-director-sms/:code/:id',
            name: 'verify.director.sms',
            component: () => import('./views/Auth/VerifyDirectorSms'),
            meta: {
                title: 'JBid Verify SMS',
            }
        },
        {
            path: '/verify/phone',
            name: 'verify.phone',
            component: () => import('./views/Auth/VerifyPhone.vue'),
            meta: {
                title: 'JBid Verify Phone',
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/Auth/Login.vue'),
            meta: {
                title: 'JBid Login',
            }
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: () => import('./views/Auth/ForgotPassword.vue'),
            meta: {
                title: 'JBid Forgot Password',
            }
        },
        {
            path: '/set-password',
            name: 'set-password',
            component: () => import('./views/Auth/SetPassword.vue'),
            meta: {
                title: 'JBid Set Password',
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('./views/Auth/Register.vue'),
            meta: {
                title: 'JBid Registration',
            },

        },
        {
            path: '/register/confirm',
            name: 'register.confirm',
            component: () => import('./views/Auth/EmailSent.vue'),
            meta: {
                title: 'JBid Confirm Registration',
            }
        },
        {
            path: '/quote',
            name: 'quote',
            component: () => import('./views/Quote.vue'),
            meta: {
                title: 'Bidbond Quote',
            }
        },
        {
            path: 'terms',
            name: 'terms',
            component: () => import('./views/Terms.vue'),
            meta: {
                title: 'Terms & Conditions',
            }
        },
        {
            path: '/bid-bonds/:bidbond/:company?',
            name: 'bidbonds.validate',
            component: () => import('./views/ValidateBidBond.vue'),
            meta: {
                title: 'JBid validate Bid bond',
            }
        },
        {
            path: '/dashboard',
            component: () => import('./views/Dashboard.vue'),
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('./views/Dashboard/Home.vue'),
                    meta: {
                        title: 'Dashboard',
                    }
                },
                {
                    path: 'wallet',
                    name: 'wallet',
                    component: () => import('./views/Dashboard/Wallet.vue')
                },
                {
                    path: '/marketing',
                    name: 'marketing',
                    component: () => import('./views/Dashboard/Marketing.vue'),
                    meta: {
                        title: 'Marketing',
                    }
                },
                {
                    path: 'profile',
                    component: () => import('./views/Dashboard/Profile.vue'),
                    children: [
                        {
                            path: '',
                            name: 'profile.info',
                            component: () => import('./views/Dashboard/Profile/Info.vue'),
                            meta: {
                                title: 'JBid Profile Info',
                            }
                        },
                        {
                            path: 'security',
                            name: 'profile.security',
                            component: () => import('./views/Dashboard/Profile/Security.vue'),
                            meta: {
                                title: 'Security',
                            }
                        }
                    ]
                },
                {
                    path: 'companies',
                    component: () => import('./views/Dashboard/Companies.vue'),
                    children: [
                        {
                            path: '',
                            name: 'companies.index',
                            component: () => import('./views/Dashboard/Companies/Index.vue'),
                            meta: {
                                title: 'JBid Companies',
                            }
                        },
                        {
                            path: 'companies/deleted',
                            name: 'companies.deleted',
                            component: () => import('./views/Dashboard/Companies/Deleted.vue'),
                            meta: {
                                title: 'JBid Deleted Companies',
                            }
                        },
                        {
                            path: 'create',
                            name: 'companies.create',
                            component: () => import('./views/Dashboard/Companies/Create.vue'),
                            meta: {
                                title: 'JBid New Company',
                            }
                        },
                        {
                            path: ':id',
                            name: 'companies.show',
                            component: () => import('./views/Dashboard/Companies/Show.vue'),
                            meta: {
                                title: 'JBid Companies',
                            }
                        },
                        {
                            path: ':id/users',
                            name: 'companies.users',
                            component: () => import('./views/Dashboard/Companies/Users.vue'),
                            meta: {
                                title: 'JBid Users',
                            }
                        },
                        {
                            path: ':id/payment',
                            name: 'companies.payment',
                            component: () => import('./views/Dashboard/Companies/Payment.vue'),
                            meta: {
                                title: 'JBid Payment',
                            }
                        },
                        {
                            path: ':id/searching',
                            name: 'companies.searching',
                            component: () => import('./views/Dashboard/Companies/Searching.vue'),
                            meta: {
                                title: 'JBid Searching',
                            }
                        },
                        {
                            path: ':id/directors/create',
                            name: 'companies.directors.create',
                            component: () => import('./views/Dashboard/Companies/Directors/Create.vue'),
                            meta: {
                                title: 'JBid Directors',
                            }
                        },
                        {
                            path: 'agents',
                            name: 'companies.agents',
                            component: () => import('./views/Dashboard/Companies/Agents.vue'),
                            meta: {
                                title: 'Agents',
                            }
                        },
                    ]
                },
                {
                    path: 'bidbonds',
                    component: () => import('./views/Dashboard/BidBonds.vue'),
                    children: [
                        {
                            path: '',
                            name: 'bidbonds.index',
                            component: () => import('./views/Dashboard/BidBonds/Index.vue'),
                            meta: {
                                title: 'JBid Bid bonds',
                            }
                        },
                        {
                            path: 'create/:tender_no?/:company_id?',
                            name: 'bidbonds.create',
                            component: () => import('./views/Dashboard/BidBonds/Create.vue'),
                            meta: {
                                title: 'JBid New Bid bond',
                            }
                        },
                        {
                            path: ':id',
                            name: 'bidbonds.edit',
                            component: () => import('./views/Dashboard/BidBonds/Edit.vue'),
                            meta: {
                                title: 'JBid Edit Bid bond',
                            }
                        },
                        {
                            path: ':id/:co/payment',
                            name: 'bidbonds.payment',
                            component: () => import('./views/Dashboard/BidBonds/Payment.vue'),
                            meta: {
                                title: 'JBid Show Company Payment',
                            }
                        },
                        {
                            path: ':id/:co?',
                            name: 'bidbonds.show',
                            component: () => import('./views/Dashboard/BidBonds/Show.vue'),
                            meta: {
                                title: 'Show Bid bond',
                            }
                        }
                    ]
                },
                {
                    path: 'bid-bond-pricing',
                    name: 'bid-bond-pricing.index',
                    component: () => import('./views/Dashboard/BidBondPricing/Index.vue'),
                    meta: {
                        title: 'Pricing',
                    }
                },
                {
                    path: 'bid-bond-pricing/create',
                    name: 'bid-bond-pricing.create',
                    component: () => import('./views/Dashboard/BidBondPricing/Create.vue'),
                    meta: {
                        title: 'Create Pricing',
                    }
                },
                {
                    path: 'pricing-group',
                    name: 'pricing-group',
                    component: () => import('./views/Dashboard/BidBondPricing/Groups.vue'),
                    meta: {
                        title: 'Pricing Groups',
                    }
                },
                {
                    path: 'quotes',
                    component: () => import('./views/Dashboard/Quotes.vue'),
                    children: [
                        {
                            path: '',
                            name: 'quotes.index',
                            component: () => import('./views/Dashboard/Quotes/Index.vue'),
                            meta: {
                                title: 'JBid Quotes',
                            }
                        },
                        {
                            path: 'create',
                            name: 'quotes.create',
                            component: () => import('./views/Dashboard/Quotes/Create.vue'),
                            meta: {
                                title: 'New Quote',
                            }
                        }
                    ]
                },
                {
                    path: 'payments',
                    name: 'payments.index',
                    component: () => import('./views/Dashboard/Payments/Index.vue'),
                    meta: {
                        title: 'Payments',
                    }
                },
                {
                    path: 'users',
                    component: () => import('./views/Dashboard/Users.vue'),
                    children: [
                        {
                            path: '',
                            name: 'users.index',
                            component: () => import('./views/Dashboard/Users/Index.vue'),
                            meta: {
                                title: 'JBid Users',
                            }
                        },
                        {
                            path: 'deleted',
                            name: 'users.deleted',
                            component: () => import('./views/Dashboard/Users/Deleted.vue'),
                            meta: {
                                title: 'JBid Deleted Users',
                            }
                        },
                        {
                            path: 'roles',
                            name: 'users.roles',
                            component: () => import('./views/Dashboard/Users/Roles.vue'),
                            meta: {
                                title: 'JBid Roles',
                            }
                        },
                        {
                            path: 'permissions',
                            name: 'users.permissions',
                            component: () => import('./views/Dashboard/Users/Permissions.vue'),
                            meta: {
                                title: 'JBid Permissions',
                            }
                        },
                        {
                            path: 'create',
                            name: 'users.create',
                            component: () => import('./views/Dashboard/Users/Create.vue'),
                            meta: {
                                title: 'JBid Create User',
                            }
                        },
                        {
                            path: 'customers',
                            name: 'users.customers',
                            component: () => import('./views/Dashboard/Users/Customers.vue'),
                            meta: {
                                title: 'JBid Customers',
                            }
                        },
                        {
                            path: ':id',
                            name: 'users.show',
                            component: () => import('./views/Dashboard/Users/Show.vue'),
                            meta: {
                                title: 'JBid Show User',
                            }
                        },
                        {
                            path: ':id/edit',
                            name: 'users.edit',
                            component: () => import('./views/Dashboard/Users/Edit.vue'),
                            meta: {
                                title: 'Edit User',
                            }
                        },
                    ]
                },
                {
                    path: 'reports',
                    component: () => import('./views/Dashboard/Reports/Dashboard/Summary.vue'),
                    children: [
                        {
                            path: 'quotes',
                            name: 'reports.quotes',
                            component: () => import('./views/Reports/Quotes/Index.vue')
                        },
                        {
                            path: '',
                            name: 'reports.summary',
                            component: () => import('./views/Dashboard/Reports/Dashboard/NavTab.vue')
                        },
                        {
                            path: 'companies',
                            name: 'reports.companies',
                            component: () => import('./views/Reports/Companies/Index.vue')
                        },
                        {
                            path: 'bidbonds',
                            name: 'reports.bidbonds',
                            component: () => import('./views/Reports/Bidbonds/Index.vue')
                        },
                        {
                            path: 'payments',
                            name: 'reports.payments',
                            component: () => import('./views/Dashboard/Reports/Payments.vue')
                        },
                        {
                            path: 'earnings',
                            name: 'reports.earnings',
                            component: () => import('./views/Dashboard/Reports/Earnings.vue')
                        },
                        {
                            path: 'company',
                            name: 'reports.companies',
                            component: () => import('./views/Dashboard/Reports/Company.vue'),
                            meta: {
                                title: 'Company Reports',
                            }
                        }
                    ]
                },
                {
                    path: 'agents',
                    component: () => import('./views/Dashboard/Agents.vue'),
                    children: [
                        {
                            path: '',
                            name: 'agents.index',
                            component: () => import('./views/Dashboard/Agents/Index.vue'),
                            meta: {
                                title: 'JBid Agents',
                            }
                        },
                        {
                            path: 'deleted',
                            name: 'agents.deleted',
                            component: () => import('./views/Dashboard/Agents/Deleted.vue'),
                            meta: {
                                title: 'JBid Deleted Agents',
                            }
                        },
                        {
                            path: 'create',
                            name: 'agents.create',
                            component: () => import('./views/Dashboard/Agents/Create.vue'),
                            meta: {
                                title: 'JBid New Agent',
                            }
                        },
                        {
                            path: ':id',
                            name: 'agents.show',
                            component: () => import('./views/Dashboard/Agents/Show.vue'),
                            meta: {
                                title: 'Show Agent',
                            }
                        },
                    ],
                },
                {
                    path: 'commission',
                    name: 'commission.index',
                    component: () => import('./views/Dashboard/Commission/Index.vue'),
                    meta: {
                        title: 'CounterParties',
                    }
                },
                {
                    path: 'counter-parties',
                    name: 'counter-parties.index',
                    component: () => import('./views/Dashboard/CounterParties/Index.vue')
                },
                {
                    path: 'counter-parties/create',
                    name: 'counter-parties.create',
                    component: () => import('./views/Dashboard/CounterParties/Create.vue'),
                    meta: {
                        title: 'New CounterParty',
                    }
                },
                {
                    path: 'bid-bond-templates',
                    component: () => import('./views/Dashboard/BidBondTemplates.vue'),
                    children: [
                        {
                            path: '',
                            name: 'bid-bond-templates.index',
                            component: () => import('./views/Dashboard/BidBondTemplates/Index.vue'),
                            meta: {
                                title: 'Templates',
                            }
                        },
                        {
                            path: 'create',
                            name: 'bid-bond-templates.create',
                            component: () => import('./views/Dashboard/BidBondTemplates/Create.vue'),
                            meta: {
                                title: 'New Template',
                            }
                        },
                        {
                            path: ':id',
                            name: 'bid-bond-templates.show',
                            component: () => import('./views/Dashboard/BidBondTemplates/Show.vue'),
                            meta: {
                                title: 'View Bid bond',
                            }
                        },
                        {
                            path: ':id/edit',
                            name: 'bid-bond-templates.edit',
                            component: () => import('./views/Dashboard/BidBondTemplates/Edit.vue'),
                            meta: {
                                title: 'Edit Bid bond Template',
                            }
                        }
                    ]
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('./views/Dashboard/Settings.vue'),
                    children: [
                        {
                            path: '',
                            name: 'settings.index',
                            component: () => import('./views/Dashboard/Settings/Settings.vue'),
                            meta: {
                                title: 'JBid Settings',
                            }
                        },
                        {
                            path: 'pricing',
                            name: 'settings.pricing',
                            component: () => import('./views/Dashboard/Settings/Pricing.vue'),
                            meta: {
                                title: 'JBid Pricing',
                            }
                        },
                        {
                            path: 'kyc',
                            name: 'settings.kyc',
                            component: () => import('./views/Dashboard/Settings/Kyc.vue'),
                            meta: {
                                title: 'JBid Kyc',
                            }
                        },
                    ]
                },
                {
                    path: 'help',
                    name: 'help',
                    component: () => import('./views/Dashboard/Help.vue'),
                    meta: {
                        title: 'Help',
                    }
                },
                {
                    path: 'whats-new',
                    name: 'whats-new',
                    component: () => import('./views/Dashboard/WhatsNew.vue'),
                    meta: {
                        title: 'JBid New',
                    }
                },
                {
                    path: 'terms-conditions',
                    name: 'terms-conditions',
                    component: () => import('./views/Dashboard/TermsCond.vue'),
                    meta: {
                        title: 'Terms & Conditions',
                    }
                },
                {
                    path: 'privacy',
                    name: 'privacy',
                    component: () => import('./views/Dashboard/Privacy.vue'),
                    meta: {
                        title: 'Privacy Policy',
                    }
                }
            ]
        },
        {
            path: '*',
            name: '404',
            component: () => import('./views/404.vue'),
            meta: {
                title: 'JBid Page Not Found',
            }
        }
    ]
})
