// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.
import fs from 'fs'

export default (config) => ({
    ...config,
    //lancertech wechat.
    cfg: 'coin',
    domain: 'mp.qingshansi.cn', //本站域名
    db: {
        database: "wpcoin", //数据库名
        username: "<your-db-username>", //数据库用户名
        password: "<your-db-password>", //数据库用户密码
        options: {
            host: "localhost", //数据库服务器地址
            port: 3306, //端口
            dialect: "mysql",
            logging: function () {},
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            dialectOptions: {
                collate: 'utf8mb4_unicode_ci', //支持表情字符
                charset: 'utf8mb4', //支持表情字符
                socketPath: "/var/run/mysqld/mysqld.sock"
            },
            define: {
                paranoid: true
            }
        }
    },
    wechat : {
        origin:'<本公众号原始id>',
        appId:'<本公众号APPID>', 
        appSecret:'<本公众号appSecret>', 
        encodingAESKey:'<本公众号encodingAESKey>',
        token:'<本公众号token>',

        templateLuckyResult: '6P0gkBJlimIBW5GDFFwNgvauakQLM4f0VHHJkL2zHWk', //模板消息的模板id，增加模板消息功能后，可以去微信mp后台添加
        templatePaySucess: 'bPKQz3bJqZ_LUdmcUTBqLcZ60w1t_aunCuopWCzoMrw',
        templateRefundNotify: '-P2mc2E88Te-Ml-xc7WhNNM7nAm0hRE0MiHCpF_ESdc',
        templateOrderCancel: 'q4jpFEjimEHoUK0Pzf7PRAva3mgWdHFAXM8eRCAQX60',
    },
    wechatPay : {
        appId:'<服务商APPID>', //服务商APPID，邮件中
        mchId: '<服务商商户号>',
        notifyUrl: '<服务商微信支付通知URL地址>',
        partnerKey: '<服务商partnerKey>',
        subAppId:'<特约商户APPID>',
        subMchId: '<特约商户号>',
        pfx: fs.readFileSync(__dirname + '/apiclient_cert_1411146202.p12'), //服务商的apiclient_cert_1411146202
        passphrase:'1411146202',//密码，默认为服务商商户号
    },
})
