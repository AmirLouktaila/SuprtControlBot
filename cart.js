const crypto = require("crypto");
const axios = require('axios');

class AliExpressLibraryCart {
    constructor(AppKey, API_SECRET, Tracking_ID) {
        this.API_URL = "https://api-sg.aliexpress.com/sync";
        this.AppKey = AppKey;
        this.API_SECRET = API_SECRET;
        this.Tracking_ID = Tracking_ID;
    }

    hash(method, s, format) {
        const sum = crypto.createHash(method);
        const isBuffer = Buffer.isBuffer(s);
        if (!isBuffer && typeof s === "object") {
            s = JSON.stringify(this.sortObject(s));
        }
        sum.update(s, "utf8");
        return sum.digest(format || "hex");
    }

    sortObject(obj) {
        return Object.keys(obj)
            .sort()
            .reduce(function (result, key) {
                result[key] = obj[key];
                return result;
            }, {});
    }

    signRequest(parameters) {
        const sortedParams = this.sortObject(parameters);
        const sortedString = Object.keys(sortedParams).reduce((acc, objKey) => {
            return `${acc}${objKey}${sortedParams[objKey]}`;
        }, "");
        const bookstandString = `${this.API_SECRET}${sortedString}${this.API_SECRET}`;
        const signedString = this.hash("md5", bookstandString, "hex");
        return signedString.toUpperCase();
    }

    async getData(link) {
        const payload = {
            app_key: this.AppKey,
            sign_method: "md5",
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            format: "json",
            v: "2.0",
            method: "aliexpress.affiliate.link.generate",
            promotion_link_type: 0,
            tracking_id: this.Tracking_ID,
            source_values: link,
        };
        const sign = this.signRequest(payload);
        const allParams = {
            ...payload,
            sign,
        };
        try {
            const response = await axios.post(this.API_URL, new URLSearchParams(allParams));
            return response.data.aliexpress_affiliate_link_generate_response.resp_result.result.promotion_links.promotion_link[0].promotion_link;
        } catch (error) {
            throw new Error(`API Request Error: ${error.message}`);
        }
    }
}

module.exports = AliExpressLibraryCart;
const botToken = "6680651980:AAEtbpQ2TjbMV7UYRZO_uH2DlDWZXJDgJoE";
const appkey = "501598";
const secertkey = " HbEPm2i7dym1S8ix34u3MyBVsYKspvTe";
const tarckin_id = " lkt111";
const IdChannel = "@okbb_love";
const Channel = "https://t.me/okbb_love";
const link_cart = " process.env.cart";
const supabase = createClient("https://ggjmijpeisfgkjimtsht.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnam1panBlaXNmZ2tqaW10c2h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzU1NTM4MCwiZXhwIjoyMDI5MTMxMzgwfQ.--HYgqFqgifbnvnNxtwjNKvu4cKnRK8xMII4smxJJ4k", { auth: { persistSession: false } });
