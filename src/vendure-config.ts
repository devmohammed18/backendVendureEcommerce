
// import {
//     dummyPaymentHandler,
//     DefaultJobQueuePlugin,
//     DefaultSchedulerPlugin,
//     DefaultSearchPlugin,
//     VendureConfig,
// } from '@vendure/core';
// import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
// import { AssetServerPlugin } from '@vendure/asset-server-plugin';
// import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
// import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
// import 'dotenv/config';
// import path from 'path';

// const IS_DEV = process.env.APP_ENV === 'dev';
// const serverPort = +process.env.PORT || 10000;
// const APP_URL = process.env.APP_URL || 'https://backendvendureecommerce.onrender.com/shop-api';
// export const config: VendureConfig = {

     
//     apiOptions: {
     


//         port: serverPort,
//         adminApiPath: 'admin-api',
//         shopApiPath: 'shop-api',
//         trustProxy: IS_DEV ? false : 1,
//         // The following options are useful in development mode,
//         // but are best turned off for production for security
//         // reasons.
//         ...(IS_DEV ? {
//             adminApiDebug: true,
//             shopApiDebug: true,
//         } : {}),
//     },
//     authOptions: {
//         tokenMethod: ['bearer', 'cookie'],
//         requireVerification: process.env.APP_ENV === 'dev' ? false : true, // regler probleme les email
//         superadminCredentials: {
//             identifier: process.env.SUPERADMIN_USERNAME,
//             password: process.env.SUPERADMIN_PASSWORD,
//         },
//         cookieOptions: {
//           secret: process.env.COOKIE_SECRET,
//         },
//     },
//     dbConnectionOptions: {
//         type: 'postgres',
//         // See the README.md "Migrations" section for an explanation of
//         // the `synchronize` and `migrations` options.
//         synchronize: false,
//         migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
//         logging: false,
//         database: process.env.DB_NAME,
//         schema: process.env.DB_SCHEMA,
//         host: process.env.DB_HOST,
//         port: +process.env.DB_PORT,
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         ssl: { rejectUnauthorized: false },  // ← OBLIGATOIRE pour Supabase
       
//     },
//     paymentOptions: {
//         paymentMethodHandlers: [dummyPaymentHandler],
//     },
//     // When adding or altering custom field definitions, the database will
//     // need to be updated. See the "Migrations" section in README.md.
//     customFields: {},
//     plugins: [
//         GraphiqlPlugin.init(),
//         AssetServerPlugin.init({
//             route: 'assets',
            
//             assetUploadDir: path.join(__dirname, '../static/assets'),
//             // For local dev, the correct value for assetUrlPrefix should
//             // be guessed correctly, but for production it will usually need
//             // to be set manually to match your production url.
//              assetUrlPrefix: IS_DEV ? undefined : `${APP_URL}/assets/`,  // ✅ URL dynamique
//             //assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
//         }),
//         DefaultSchedulerPlugin.init(),
//         DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
//         DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
//         EmailPlugin.init({
//             // devMode: true,  // ✅ false en production
//             // outputPath: path.join(__dirname, '../static/email/test-emails'),
//             // route: 'mailbox',
//              ...(IS_DEV
//         ? {
//               devMode: true as const,
//               outputPath: path.join(__dirname, '../static/email/test-emails'),
//               route: 'mailbox',
//           }
//         : {
//               transport: {
//                   type: 'smtp',
//                   host: process.env.SMTP_HOST,
//                   port: 587,
//                   auth: {
//                       user: process.env.SMTP_USER,
//                       pass: process.env.SMTP_PASS,
//                   },
//               },
//           }),

//             handlers: defaultEmailHandlers,
//             templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
//             globalTemplateVars: {
//                 // The following variables will change depending on your storefront implementation.
//                 // Here we are assuming a storefront running at http://localhost:8080.
//                 fromAddress: '"example" <noreply@example.com>',
//                 verifyEmailAddressUrl: 'http://localhost:8080/verify',
//                 passwordResetUrl: 'http://localhost:8080/password-reset',
//                 changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
//             },
//         }),
//         AdminUiPlugin.init({
//             route: 'admin',
//             port: serverPort,
//            adminUiConfig: {
//         apiHost: IS_DEV ? 'http://localhost' : APP_URL,  // ✅ localhost en dev
//         apiPort: IS_DEV ? serverPort : 443,               // ✅ bon port selon env
//            },
//         }),
//     ],
// };

import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { StripePlugin } from '@vendure-community/payments-plugin/package/stripe'
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import { CloudinaryAssetStorageStrategy } from './plugins/cloudinary-asset-storage-strategy';
import 'dotenv/config';
import path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 10000;
const APP_URL = process.env.APP_URL 

export const config: VendureConfig = {
    apiOptions: { 
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
   
    // ✅ AJOUTER CECI
    cors: {
        origin: IS_DEV 
            ? 'http://localhost:3000'                        // ton port Next.js local
            : 'https://ton-frontend.vercel.app',            // ← URL exacte de ton frontend
        credentials: true,                                   // OBLIGATOIRE pour les cookies
        methods: ['GET', 'POST', 'OPTIONS'],
    },


        ...(IS_DEV ? {
            adminApiDebug:true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        requireVerification: process.env.APP_ENV === 'dev' ? false : true,
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false },
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
  // ✅ Ajouter StripePlugin
   StripePlugin.init({
      storeCustomersInStripe: false,
    }),


        // ✅ AssetServerPlugin avec Cloudinary en production, local en dev
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: IS_DEV
                ? path.join(__dirname, '../static/assets')
                : '/tmp/vendure/assets',
            
            // ✅ Cloudinary activé en dev ET en production
            storageStrategyFactory: () => new CloudinaryAssetStorageStrategy(),

            assetUrlPrefix: IS_DEV ? undefined : undefined,
        }),


        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),

        EmailPlugin.init({
            ...(IS_DEV
                ? {
                    devMode: true as const,
                    outputPath: path.join(__dirname, '../static/email/test-emails'),
                    route: 'mailbox',
                }
                : {
                    transport: {
                        type: 'smtp',
                        host: process.env.SMTP_HOST,
                        port: 587,
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
                        },
                    },
                }),
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change',
            },
        }),

        AdminUiPlugin.init({
            route: 'admin',
            port: serverPort,
            adminUiConfig: {
                apiHost: IS_DEV ? 'http://localhost' : APP_URL,
                apiPort: IS_DEV ? serverPort : 443,
            },
        }),
    ],
};