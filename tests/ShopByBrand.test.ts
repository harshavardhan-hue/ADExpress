import { test, expect } from '@playwright/test';
import { DataManager } from '../Shop_By_Brand/DataManager';
import { CREDENTIALS } from '../utils/credentials';

test.describe('Shop By Brand - Sequential Brand Navigation', () => {

    const cbdBrands = [
        { name: 'ONLY CBD', href: 'only-cbd' },
        { name: 'ERTH WELLNESS CBD', href: 'erth-wellness-cbd' },
        { name: 'JUST CBD', href: 'just-cbd' },
        { name: 'DRAGON CBD', href: 'dragon-cbd' },
        { name: 'ENJOY HEMP CBD', href: 'enjoy-hemp-cbd' },
        { name: 'PET\'S BOTANICALS', href: 'pets-botanicals' },
        { name: 'THINK BOTANICALS CBD', href: 'think-botanicals-cbd' },
        { name: 'PLANTED ROOT CBD', href: 'planted-root-cbd' },
        { name: 'NARCO CBD', href: 'narco-cbd' },
        { name: 'MOON BUZZ CBD', href: 'moon-buzz-cbd' },
        { name: 'CRISPY BLUNTS', href: 'crispy-blunts-blend' },
        { name: 'BOLT CBD', href: 'bolt-cbd' },
        { name: 'JOYPET CBD', href: 'joypet-cbd' },
        { name: 'ALCHEMY CBD', href: 'alchemy-cbd' },
        { name: 'WILD HEMP', href: 'wild-hemp' }
    ];

    const batteryBrands = [
        { name: 'CARTISAN BATTERY', href: 'cartisan-battery' },
        { name: 'BIGFUN!', href: 'bigfun' },
        { name: 'TSUNAMI BATTERY', href: 'tsunami-battery' },
        { name: 'BATTERY', href: 'battery' },
        { name: 'SPACEHERO BATTERY', href: 'spacehero-battery' },
        { name: 'YOCAN BATTERY', href: 'yocan-battery' },
        { name: 'SMYLE BATTERY', href: 'smyle-batt' },
        { name: 'NEU BATTERY', href: 'neu-battery' },
        { name: 'IMREN', href: 'imren' },
        { name: 'CONIC BATTERY', href: 'conic-battery' },
        { name: 'STIIIZY BATTERY', href: 'stiiizy-battery' },
        { name: 'OOZE BATTERY', href: 'ooze-battery' },
        { name: 'LOOKAH BATTERY', href: 'lookah-battery' },
        { name: 'EXTRE BATTERY', href: 'extre-battery' },
        { name: 'DOTECO BATTERY', href: 'doteco-battery' },
        { name: 'UTPAL', href: 'utpal' },
        { name: 'BINOO BATTERY', href: 'binoo-battery' },
        { name: 'SMOQ BATTERY', href: 'smoq-battery' },
        { name: 'BABY STONER', href: 'baby-stoner' },
        { name: 'VAPCELL', href: 'vapce' },
        { name: 'ROCK ME BATTERY', href: 'rock-me-battery' },
        { name: 'HITTZY BATTERY', href: 'hittzy-battery' },
        { name: 'FLAKA', href: 'flaka' },
        { name: 'GEEK BAR DISPO', href: 'geek-bar-dispo' },
        { name: 'IMPERIAL BATTERY', href: 'imperial-battery' },
        { name: 'BLAZY SUSAN BATTERY', href: 'blazy-susan-battery' },
        { name: 'CCELL', href: 'ccell' },
        { name: 'DAZZLEAF BATTERY', href: 'dazzleaf-battery' },
        { name: 'URB BATTERY', href: 'urb-battery' },
        { name: 'GANGSTER DISPO', href: 'gangster-batt' },
        { name: 'VAPLUCKY BATTERIES', href: 'vaplucky-batteries' }
    ];

    const glassBrands = [
        { name: 'MJ ARSENAL', href: 'mj-arsenal' },
        { name: 'WATER PIPE', href: 'water-pipe' },
        { name: 'GLASS JARS', href: 'glass-jars' },
        { name: 'HAND PIPE', href: 'hand-pipe' },
        { name: 'GLASS ACCESSORIES', href: 'glass-accessories' },
        { name: 'RAW GLASS', href: 'raw-glass' },
        { name: 'BUBBLER', href: 'glass-bubbler' },
        { name: 'TSUNAMI GLASS', href: 'tsunami-glass' },
        { name: 'CHILLUM', href: 'chillum' },
        { name: 'ASH CATCHER', href: 'ash-catcher' },
        { name: 'GLASS TUBES', href: 'glass-tubes' },
        { name: 'PHOENIX GLASS', href: 'phoenix-glass' },
        { name: 'OILSEED GLASS', href: 'oilseed-glass' },
        { name: 'CALIBEAR GLASS', href: 'calibear-glass' },
        { name: 'GIFT SET', href: 'gift-set' },
        { name: 'METAL / CERAMIC HITTER', href: 'metal-ceramic-hitter' },
        { name: 'REG GRINDERS', href: 'reg-grinders' },
        { name: 'OILSEED', href: 'oilseed' },
        { name: 'BABY STONER', href: 'baby-stoner' },
        { name: 'BANGER GLASS', href: 'banger-glass' },
        { name: 'HEMPER GLASS', href: 'hemper-glass' },
        { name: 'BOWLS', href: 'bowls' },
        { name: 'NECTOR COLLECTOR', href: 'nector-collector' },
        { name: 'CARB CAP', href: 'carb-cap' },
        { name: 'SHERLOCK PIPE', href: 'sherlock-pipe' },
        { name: 'OOZE GLASS', href: 'ooze-glass' },
        { name: 'FENG SHUN', href: 'feng-shun' },
        { name: 'DABBER', href: 'dabber' },
        { name: 'RANDY\'S GLASS', href: 'randys-glass' },
        { name: 'GRAV', href: 'grav' },
        { name: 'DOWNSTEM', href: 'downstem' },
        { name: 'LOOKAH GLASS', href: 'lookah-glass' },
        { name: 'ROOR', href: 'roor' },
        { name: 'SMOQ GLASS', href: 'smoq-glass' },
        { name: 'SLOPPY HIPPO', href: 'sloppy-hippo' },
        { name: 'RANDYS PAPERS', href: 'randys-papers' },
        { name: 'WHITE RHINO', href: 'white-rhino' },
        { name: 'CLOVER GLASS', href: 'clover-glass' },
        { name: 'FORMULA', href: 'formula' },
        { name: 'BIG B MOM GLASS', href: 'big-b-mom-glass' },
        { name: 'TATAOO GLASS', href: 'tataoo-glass' }
    ];

    test.beforeEach(async ({ page, context }) => {
        const poManager = new DataManager(page, context);
        const loginPage = poManager.getLoginPage();

        console.log('[Setup] Logging in...');
        await page.goto('https://americandistributorsllc.com/myaccount?tab=login');
        await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
        await page.waitForURL('**/', { timeout: 30000 });

        const dismissBtn = page.getByRole('button', { name: 'Continue' });
        if (await dismissBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await dismissBtn.click();
        }
    });

    test('Iterate through all highlighted CBD brands', async ({ page, context }) => {
        test.setTimeout(450000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < cbdBrands.length; i++) {
            const brand = cbdBrands[i];

            // Navigate directly to the brand page
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[CBD] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

    test('Iterate through all highlighted BATTERY brands', async ({ page, context }) => {
        test.setTimeout(900000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < batteryBrands.length; i++) {
            const brand = batteryBrands[i];

            // Navigate directly to the brand page
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[BATTERY] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

    test('Iterate through all highlighted GLASS brands', async ({ page, context }) => {
        // High timeout for 41 interactions
        test.setTimeout(1200000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < glassBrands.length; i++) {
            const brand = glassBrands[i];

            // Navigate directly to the brand page
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[GLASS] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

    const creamChargerBrands = [
        { name: 'CREAM GAS', href: 'cream-gas' },
        { name: 'GOLD WHIP CHARGERS', href: 'gold-whip-chargers' },
        { name: 'INFUZD', href: 'infuzd' },
        { name: 'INFUSION CHARGERS', href: 'infusion-chargers' },
        { name: 'SPECIAL BLUE CHARGER/ DISPEN', href: 'special-blue-charger-dispen' },
        { name: 'BESTWHIP', href: 'bestwhip' },
        { name: 'WHIPIT CHARGER/ DISPEN', href: 'whipit-charger-dispen' }
    ];

    test('Iterate through all highlighted CREAM CHARGER brands', async ({ page, context }) => {
        // Timeout for 7 interactions (10 min)
        test.setTimeout(600000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < creamChargerBrands.length; i++) {
            const brand = creamChargerBrands[i];

            // Navigate directly to the brand page (cream charger sub-menu links are CSS-hidden)
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[CREAM CHARGER] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

    const dispoBrands = [
        { name: 'AIR BAR DISPO', href: 'air-bar-dispo' },
        { name: 'IJOY DISPO', href: 'ijoy-dispo' },
        { name: 'PLOOX', href: 'ploox-dispo' },
        { name: 'BERI DISPO', href: 'beri-dispo' },
        { name: 'PILLOW TALK DISPO', href: 'pillow-talk-dispo' },
        { name: 'FIFTY BAR', href: 'fifty-bar' },
        { name: 'JNR DISPO', href: 'jnr-dispo' },
        { name: 'LOST MARY DISPO', href: 'lost-mary-dispo' },
        { name: 'AIRIS DISPO', href: 'airis-dispo' },
        { name: 'OXBAR DISPO', href: 'oxbar-dispo' },
        { name: 'VOOM', href: 'voom' },
        { name: 'OLIT DISPO', href: 'olit-dispo' },
        { name: 'KADO BAR', href: 'kado-bar' },
        { name: 'GEEK BAR DISPO', href: 'geek-bar-dispo' },
        { name: 'LYCO', href: 'lyco' },
        { name: 'LEGENDBAR', href: 'legendbar' },
        { name: 'SOMMAR BAR', href: 'sommar-bar' },
        { name: 'DKHAAN', href: 'dkhaan' },
        { name: 'SPACEMAN', href: 'spaceman' },
        { name: 'GEEK CYBER TANK DISPO', href: 'geek-cyber-tank-dispo' },
        { name: 'AMERICAN VIBES', href: 'american-vibes' },
        { name: 'AL FAKHER DISPO', href: 'al-fakher-dispo' },
        { name: 'RAZ DISPO', href: 'raz-dispo' },
        { name: 'VASTA', href: 'vasta' },
        { name: 'VANMO DISPO', href: 'vanmo-dispo' },
        { name: 'KANGERTECH DISPO', href: 'kangertech-dispo' },
        { name: 'OFF STAMP DISPO', href: 'off-stamp-dispo' },
        { name: 'DOJO DISPO', href: 'dojo-dispo' },
        { name: 'GEEK X EDI', href: 'geek-x-edi' },
        { name: 'NORTH DISPO', href: 'north-dispo' },
        { name: 'PULSE ULTRA', href: 'pulse-ultra' },
        { name: 'DRAGON', href: 'dragon' },
        { name: 'FOGER DISPO', href: 'foger-ultra-dispo' },
        { name: 'HORIZON TECH', href: 'horizon-tech' },
        { name: 'APUS', href: 'apus' },
        { name: 'BREEZE', href: 'breeze' },
        { name: 'EXTRE BAR', href: 'extre-bar' },
        { name: 'GEEK MAX', href: 'geek-max' },
        { name: 'UT DISPO', href: 'ut-dispo' },
        { name: 'MR FOG DISPO', href: 'mr-fog-dispo' },
        { name: 'CLOUD KING DISPO', href: 'cloud-king-dispo' },
        { name: 'UPENDS', href: 'upends' },
        { name: 'TOMORO', href: 'tomoro' },
        { name: 'SILI BOX DISPO', href: 'sili-box-dispo' },
        { name: 'SPACE PULSE', href: 'space-pulse' },
        { name: 'AVOTX', href: 'avotx' },
        { name: 'CRYSTAL MARY', href: 'crystal-mary' },
        { name: 'FRUTTI BAR', href: 'frutti-bar' },
        { name: 'VOZOL DISPO', href: 'vozol-dispo' },
        { name: 'SYNTRIX', href: 'syntrix' },
        { name: 'YOVO DISPO', href: 'yovo-dispo' },
        { name: 'ADJUST DISPO', href: 'adjust-dispo' },
        { name: 'CROSSBAR', href: 'crossbar' },
        { name: 'STARBUZZ DISPO', href: 'starbuzz-dispo' },
        { name: 'NEXA DISPO', href: 'nexa-dispo' },
        { name: 'MOVKIN DISPO', href: 'movkin-dispo' },
        { name: 'DINNER LADY DISPO', href: 'dinner-lady-dispo' },
        { name: 'RIFBAR DISPO', href: 'rifbar-dispo' },
        { name: 'KEEP IT 100 DISPO', href: 'keep-it-100-dispo' },
        { name: 'ZENPHBAR', href: 'zenphbar' },
        { name: 'X-POSED DISPO', href: 'x-posed-dispo' },
        { name: 'SOLOBAR', href: 'solobar' },
        { name: 'PAC BAR DISPO', href: 'pac-bar-dispo' },
        { name: 'GEAK NEXX DISPO', href: 'geak-nexx-dispo' },
        { name: 'MFU DISPO', href: 'mfu-dispo' },
        { name: 'VIHO DISPO', href: 'viho-dispo' },
        { name: 'CHILLAX DISPO', href: 'chillax-dispo' },
        { name: 'SUONON DISPO', href: 'suonon-dispo' },
        { name: 'LUFFBAR DISPO', href: 'luffbar-dispo' },
        { name: 'FUME DISPO', href: 'fume-dispo' },
        { name: 'SPACE MARY DISPO', href: 'space-mary-dispo' },
        { name: 'FOG OFF DISPO', href: 'fog-off-dispo' },
        { name: 'VODO BAR DISPO', href: 'vodo-bar-dispo' },
        { name: 'KORI DISPO', href: 'kori-dispo' },
        { name: 'TUGBOAT DISPO', href: 'tugboat-dispo' },
        { name: 'SEA DISPO', href: 'sea-dispo' },
        { name: 'LOST ANGEL DISPO', href: 'lost-angel-dispo' },
        { name: 'HUZZ DISPO', href: 'huzz-dispo' },
        { name: 'SKE DISPOSABLE', href: 'ske-disposable' },
        { name: 'KANGVAPE DISPO', href: 'kangvape-dispo' },
        { name: 'BEN NORTHON DISPO', href: 'ben-northon-dispo' },
        { name: 'MEMERS DISPO', href: 'memers-dispo' },
        { name: 'RIA DISPO', href: 'ria-dispo' },
        { name: 'TYSON DISPO', href: 'tyson-dispo' },
        { name: 'HEYBAR', href: 'heybar-disposable' },
        { name: 'HOOKAH', href: 'hookah' },
        { name: 'KV TURBO DISPO', href: 'kv-turbo-dispo' },
        { name: 'QUASAR', href: 'quasar' },
        { name: 'BIG DADDY', href: 'big-daddy' },
        { name: 'JUICY BAR DISPO', href: 'juicy-bar-dispo' },
        { name: 'PRIV BAR DISPO', href: 'priv-bar-dispo' },
        { name: 'RODMAN', href: 'rodman' },
        { name: 'SMOQ DISPO', href: 'smoq-dispo' },
        { name: 'ZERO BAR DISPO', href: 'zero-bar-dispo' }
    ];

    test('Iterate through all highlighted DISPO brands', async ({ page, context }) => {
        // Timeout for 93 brands via direct URL navigation (~90 minutes)
        test.setTimeout(5400000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < dispoBrands.length; i++) {
            const brand = dispoBrands[i];

            // Navigate directly to the brand URL (reliable for large categories)
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[DISPO] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

    const eLiquidBrands = [
        { name: 'JNR DISPO', href: 'jnr-dispo' },
        { name: 'RAZ E-LIQ', href: 'raz-e-liq' },
        { name: 'NOMS E LIQ', href: 'noms-e-liq' },
        { name: 'BARISTA BREW CO.', href: 'barista-brew-co' },
        { name: 'COASTAL CLOUDS E LIQ', href: 'coastal-clouds-e-liq' },
        { name: 'TWIST E LIQ', href: 'twist-e-liq' },
        { name: 'MR FOG E LIQ', href: 'mr-fog-e-liq' },
        { name: 'I LOVE COOKIE E LIQ', href: 'i-love-cookie-e-liq' },
        { name: 'REDS E LIQ', href: 'reds-e-liq' },
        { name: 'CANDY KING E LIQ', href: 'candy-king-e-liq' },
        { name: 'SAD BOY E LIQ', href: 'sad-boy-e-liq' },
        { name: 'KEEP IT 100 E LIQ', href: 'keep-it-100-e-liq' },
        { name: 'MIGHTY VAPOR E LIQ', href: 'mighty-vapor-e-liq' },
        { name: 'FRUIT MONSTER', href: 'fruit-monster' },
        { name: 'CUSTARD MONSTER', href: 'custard-monster' },
        { name: 'CLOUD NURDZ E LIQ', href: 'cloud-nurdz-e-liq' },
        { name: 'JUICE HEAD E LIQ', href: 'juice-head-e-liq' },
        { name: 'SILVER BACK E LIQ', href: 'silver-back-e-liq' },
        { name: 'POD JUICE E LIQ', href: 'pod-juice-e-liq' },
        { name: 'JAM MONSTER E LIQ', href: 'jam-monster-e-liq' },
        { name: 'VAPETASIA E LIQ', href: 'vapetasia-e-liq' },
        { name: 'AIR FACTORY E LIQ', href: 'air-factory-e-liq' },
        { name: 'NAKED E LIQ', href: 'naked-e-liq' },
        { name: 'VGOD E LIQ', href: 'vgod-e-liq' }
    ];

    test('Iterate through all highlighted E-LIQUID brands', async ({ page, context }) => {
        // Timeout for 24 brands (10 min)
        test.setTimeout(600000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < eLiquidBrands.length; i++) {
            const brand = eLiquidBrands[i];

            // Navigate directly to the brand page
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[E-LIQUID] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

    const herbBrands = [
        { name: 'PAX HERB', href: 'pax-herb' },
        { name: 'DR DABBER', href: 'dr-dabber' },
        { name: "RANDY'S HERB", href: 'randys-herb-2' },
        { name: 'PUFFCO Herb', href: 'puffco-herb' },
        { name: 'LOOKAH HERB', href: 'lookah-herb' },
        { name: 'YOCAN Herb', href: 'yocan-herb' },
        { name: 'EXXUS', href: 'exxus' },
        { name: 'OOZE HERB', href: 'ooze-herb' },
        { name: 'VOLCANO HERB', href: 'volcano-herb' },
        { name: 'WULF', href: 'wulf' },
        { name: 'ISPURE', href: 'ispure' },
        { name: 'CAKE HERB', href: 'cake-herb' },
        { name: 'O.PEN HERB', href: 'o-pen-herb' },
        { name: 'FLAKA', href: 'flaka' },
        { name: 'HAMILTON DEVICES', href: 'hamilton-devices' },
        { name: 'FOCUS V', href: 'focus-v' },
        { name: 'VLEX Herb', href: 'vlex-herb' },
        { name: 'OILAX', href: 'oilax' },
        { name: 'MAGNET HERB', href: 'magnet-herb' },
        { name: 'HYBRID', href: 'hybrid' },
        { name: 'WHITE RHINO', href: 'white-rhino' },
        { name: 'XVAPE VISTA HERB', href: 'xvape-vista-herb' },
        { name: 'M-CODE', href: 'm-code' }
    ];

    test('Iterate through all highlighted HERB / CONCENTRATE brands', async ({ page, context }) => {
        // Timeout for 23 brands (10 min)
        test.setTimeout(600000);
        const poManager = new DataManager(page, context);
        const brandPage = poManager.getShopByBrandPage();

        for (let i = 0; i < herbBrands.length; i++) {
            const brand = herbBrands[i];

            // Navigate directly to the brand page
            await brandPage.navigateToBrandDirectly(brand.href);

            console.log(`[HERB] Verifying brand: ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();

            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
            }
        }
    });

});
