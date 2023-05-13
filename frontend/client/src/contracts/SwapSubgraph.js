"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapsForAccount = void 0;
var axios_1 = require("axios");
function getSwapsForAccount(accountAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var query, response, swaps, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n    {\n        swaps(where: { origin: \"".concat(accountAddress, "\" }){\n            origin\n            amount0\n            amount1\n            amountUSD\n            recipient\n            transaction{\n              id \n              blockNumber\n              timestamp\n              gasUsed\n              gasPrice\n            }\n            pool{\n              id \n              token0{\n                symbol\n              }\n              token1{\n                symbol\n              }\n              volumeToken0\n              volumeToken1\n          }\n        }\n    }\n  ");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post('https://api.thegraph.com/subgraphs/name/hamzabhatti125/niswapv3mumbai', { query: query })];
                case 2:
                    response = _a.sent();
                    swaps = response.data.data.swaps;
                    return [2 /*return*/, swaps];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch swaps:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getSwapsForAccount = getSwapsForAccount;
//Uniswap Polygon Mumbai Contract address
//0x4648a43B2C14Da09FdF82B161150d3F634f40491
// Replace with your account address
var accountAddress = '0x7c87243a79059BC592e5EcfF5B4776A179eBEc22';
// Call the function to get swaps for the account
getSwapsForAccount(accountAddress)
    .then(function (swaps) {
    console.log('Swaps:', JSON.stringify(swaps, null, 2));
    // Process the swaps as needed
})
    .catch(function (error) {
    console.error('Error:', error);
});
