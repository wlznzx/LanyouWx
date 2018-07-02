const fs = require('fs');
const http = require('http');
const https = require('https');
const qrcode = require('qrcode-terminal');
const querystring = require("querystring");
const axios = require('axios');
const request_info = require("./request_info");
const url = require('url');
const path = require('path');
const FileCookieStore = require('tough-cookie-filestore');
const axiosCookieJarSupport = require('node-axios-cookiejar');
const touch = require('touch');
const tough = require('tough-cookie');
const EventEmitter = require('events');
const Datastore = require('nedb');
const Promise = require('bluebird');
const getDao = require('./wx_dao');
const Contact = require("./Contact");
const {
    getUrls,
    CODES,
    SP_ACCOUNTS,
    PUSH_HOST_LIST,
} = require('./conf');

let URLS = getUrls({});

// const cookiePath = path.join('/tmp', '.cookie.json');
// const secretPath = path.join('/tmp', '.secret.json');
const cookiePath = "/opt/data/share/LanyouWx.yunos.com/cookie.json";
const secretPath = '/opt/data/share/LanyouWx.yunos.com/secret.json';
// touch.sync(cookiePath);
// const jar = new tough.CookieJar(new FileCookieStore(cookiePath));
const jar = new tough.CookieJar();
const req = axios.create({
    timeout: 35e3,
    headers: request_info.headers,
    jar,
    withCredentials: true,
    xsrfCookieName: null,
    xsrfHeaderName: null,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
});

axiosCookieJarSupport(req);
Promise.promisifyAll(Datastore.prototype);

const makeDeviceID = () => 'e' + Math.random().toFixed(15).toString().substring(2, 17);

var _loaderInstance;

class WxModule extends EventEmitter {

    static getInstance() {
        if (!_loaderInstance) {
            log.I("wltest", 'new this');
            _loaderInstance = new this();
        }
        return _loaderInstance;
    }

    constructor(options = {}) {
        super();
        // this.mWxDao = new WxDao();
        // this.mWxDao.initDB();
        this.mWxDao = getDao();
    }

    initConfig() {
        this.baseHost = '';
        this.pushHost = '';
        this.uuid = '';
        this.redirectUri = '';
        this.skey = '';
        this.sid = '';
        this.uin = '';
        this.passTicket = '';
        this.baseRequest = null;
        this.my = null;
        this.syncKey = null;
        this.formateSyncKey = '';
        this.deviceid = makeDeviceID();
        this.isReady = "false";

        clearTimeout(this.checkSyncTimer);
        clearInterval(this.updataContactTimer);
    }
    // Step 1 获取UUID.
    async fetchUUID() {
        let result;
        try {
            result = await req.get(URLS.API_jsLogin, {
                params: {
                    appid: 'wx782c26e4c19acffb',
                    fun: 'new',
                    lang: 'zh_CN',
                    _: +new Date,
                },
            });
        } catch (e) {
            log.I("wltest", 'fetch uuid network error', e);
            // network error retry
            return await this.fetchUUID();
        }

        const { data } = result;

        if (!/uuid = "(.+)";$/.test(data)) {
            throw new Error('get uuid failed');
        }

        const uuid = data.match(/uuid = "(.+)";$/)[1];
        return uuid;
    }

    /*
  	async fetchUUID() {
  			let p =  new Promise(function(resolve, reject){
	        //做一些异步操作
			https.get('https://login.weixin.qq.com/jslogin?appid=wx782c26e4c19acffb&fun=new&lang=zh_CN', (res) => {
			res.on('data', (d) => {
				var data = d.toString();
				const uuid = data.match(/uuid = "(.+)";$/)[1];
				  	resolve(uuid);
				});
			}).on('error', (e) => {
				  console.error(e);
			});
	    	});

	    this.uuid = await p;
  	}
  	*/

    // Step 2 显示二维码;
    async showQRCODE() {
        // 判断uuid是字符串;
        const qrcodeUrl = URLS.QRCODE_PATH + this.uuid;
        this.emit("qrcode", qrcodeUrl);
        qrcode.generate(qrcodeUrl.replace('/qrcode/', '/l/'), function (qrcode) {
            // log.I("wltest",qrcode);
        });
    }

    // Step 3 等待扫码;

    /*
  	async checkLoginStep() {
  		let params = querystring.stringify({
		    tip:1,
		    uuid:this.uuid,
		});

		let options = {
		    hostname: 'login.wx.qq.com',
		    port: 443,
		    path: '/cgi-bin/mmwebwx-bin/login?' + params,
		    method: 'GET',
		    headers: request_info.headers
		};
  		log.I("wltest",params);
	    let p = new Promise(function(resolve, reject){
	        //做一些异步操作
	        function _login(argument) {
	        	const req = https.request(options, (res) => {
				  res.on('data', (d) => {
				    var data = d.toString();
				    resolve(data);
				  });
				});
				req.on('error', (e) => {
				  console.error(e);
				});
				req.end();
			}
			_login();
	    });
	    return p;
  	}
  	*/

    async checkLoginStep() {
        let result;

        try {
            result = await req.get(URLS.API_login, {
                params: {
                    tip: 1,
                    uuid: this.uuid,
                    _: +new Date,
                },
            });
        } catch (e) {
            log.I("wltest", 'checkLoginStep network error', e);
            await this.checkLoginStep();
            return;
        }

        const { data } = result;

        if (!/code=(\d{3});/.test(data)) {
            // retry
            return await this.checkLoginStep();
        }

        const loginCode = parseInt(data.match(/code=(\d{3});/)[1], 10);

        switch (loginCode) {
            case 200:
                log.I("wltest", '已点击确认登录!');
                this.redirectUri = data.match(/redirect_uri="(.+)";$/)[1] + '&fun=new';
                this.baseHost = url.parse(this.redirectUri).host;
                URLS = getUrls({ baseHost: this.baseHost });
                this.emit("logged", "");
                break;

            case 201:
                log.I("wltest", '二维码已被扫描，请确认登录!');
                this.emit("scaned", "");
                break;

            case 408:
                log.I("wltest", '检查登录超时，正在重试...');
                break;

            default:
                log.I("wltest", '未知的状态，重试...');
        }

        return loginCode;
    }


    async fetchTickets() {
        let result;
        try {
            result = await req.get(this.redirectUri);
        } catch (e) {
            log.I("wltest", 'fetch tickets network error', e);
            // network error, retry
            await this.fetchTickets();
            return;
        }

        const { data } = result;

        if (!/<ret>0<\/ret>/.test(data)) {
            throw new Error('Get skey failed, restart login');
        }

        // const retM = data.match(/<ret>(.*)<\/ret>/);
        // const scriptM = data.match(/<script>(.*)<\/script>/);
        const skeyM = data.match(/<skey>(.*)<\/skey>/);
        const wxsidM = data.match(/<wxsid>(.*)<\/wxsid>/);
        const wxuinM = data.match(/<wxuin>(.*)<\/wxuin>/);
        const passTicketM = data.match(/<pass_ticket>(.*)<\/pass_ticket>/);
        // const redirectUrl = data.match(/<redirect_url>(.*)<\/redirect_url>/);

        this.skey = skeyM && skeyM[1];
        this.sid = wxsidM && wxsidM[1];
        this.uin = wxuinM && wxuinM[1];
        this.passTicket = passTicketM && passTicketM[1];
        log.I("wltest", `
      获得 skey -> ${this.skey}
      获得 sid -> ${this.sid}
      获得 uid -> ${this.uin}
      获得 pass_ticket -> ${this.passTicket}
    `);

        this.baseRequest = {
            Uin: parseInt(this.uin, 10),
            Sid: this.sid,
            Skey: this.skey,
            DeviceID: this.deviceid,
        };

        fs.writeFileSync(secretPath, JSON.stringify({
            skey: this.skey,
            sid: this.sid,
            uin: this.uin,
            passTicket: this.passTicket,
            baseHost: this.baseHost,
            baseRequest: this.baseRequest,
        }), 'utf8');
    }

    async webwxinit() {
        let result;
        try {
            result = await req.post(
                URLS.API_webwxinit, { BaseRequest: this.baseRequest }, {
                    params: {
                        pass_ticket: this.passTicket,
                        skey: this.skey,
                    },
                }
            );
        } catch (e) {
            debug('webwxinit network error', e);
            // network error retry
            await this.webwxinit();
            return;
        }

        const { data } = result;

        if (!data || !data.BaseResponse || data.BaseResponse.Ret !== 0) {
            throw new Error('Init Webwx failed');
        }

        log.I("wltest", "-------webwxinit-------");
        log.I("wltest", data.StatusNotifyUserName);

        this.my = data.User;
        this.syncKey = data.SyncKey;
        this.chatSet = data.ChatSet;
        this.formateSyncKey = this.syncKey.List.map((item) => item.Key + '_' + item.Val).join('|');
    }

    async notifyMobile() {
        let result;
        try {
            result = await req.post(
                URLS.API_webwxstatusnotify, {
                    BaseRequest: this.baseRequest,
                    Code: CODES.StatusNotifyCode_INITED,
                    FromUserName: this.my.UserName,
                    ToUserName: this.my.UserName,
                    ClientMsgId: +new Date,
                }, {
                    params: {
                        lang: 'zh_CN',
                        pass_ticket: this.passTicket,
                    },
                }
            );
        } catch (e) {
            log.I("wltest", 'notify mobile network error', e);
            // network error retry
            await this.notifyMobile();
            return;
        }

        const { data } = result;
        log.I("wltest", "-------notifyMobile-------");
        log.I("wltest", data);

        if (!data || !data.BaseResponse || data.BaseResponse.Ret !== 0) {
            throw new Error('通知客户端失败');
        }
    }

    async lookupSyncCheckHost() {
        for (let host of PUSH_HOST_LIST) {
            let result;
            try {
                result = await req.get('https://' + host + '/cgi-bin/mmwebwx-bin/synccheck', {
                    params: {
                        r: +new Date,
                        skey: this.skey,
                        sid: this.sid,
                        uin: this.uin,
                        deviceid: this.deviceid,
                        synckey: this.formateSyncKey,
                        _: +new Date,
                    },
                });
            } catch (e) {
                log.I("wltest", 'lookupSyncCheckHost network error', host);
                // network error retry
                break;
            }

            const { data } = result;

            const retcode = data.match(/retcode:"(\d+)"/)[1];
            if (retcode === '0') return host;
        }
    }


    async syncCheck() {
        let result;
        try {
            result = await req.get(
                URLS.API_synccheck, {
                    params: {
                        r: +new Date(),
                        skey: this.skey,
                        sid: this.sid,
                        uin: this.uin,
                        deviceid: this.deviceid,
                        synckey: this.syncKey,
                        _: +new Date(),
                    },
                }
            );
        } catch (e) {
            log.I("wltest", 'synccheck network error', e);
            // network error retry
            return await this.syncCheck();
        }

        const { data } = result;
        const retcode = data.match(/retcode:"(\d+)"/)[1];
        const selector = data.match(/selector:"(\d+)"/)[1];;
        if (retcode !== '0') {
            // this.runLoop();
            return;
        }

        if (selector !== '0') {
            this.webwxsync();
        }

        clearTimeout(this.checkSyncTimer);
        this.checkSyncTimer = setTimeout(() => {
            this.syncCheck();
        }, 800);
    }

    async fetchContact() {
        let result;
        try {
            result = await req.post(
                URLS.API_webwxgetcontact, {}, {
                    params: {
                        pass_ticket: this.passTicket,
                        skey: this.skey,
                        r: +new Date,
                    },
                }
            );
        } catch (e) {
            log.I("wltest", 'fetch contact network error', e);
            // network error retry
            await this.fetchContact();
            return;
        }

        const { data } = result;

        if (!data || !data.BaseResponse || data.BaseResponse.Ret !== 0) {
            throw new Error('获取通讯录失败');
        }

        this.mWxDao.Members.insert(data.MemberList);
        this.mWxDao.totalMemberCount = data.MemberList.length;
        this.mWxDao.brandCount = 0;
        this.mWxDao.spCount = 0;
        this.mWxDao.groupCount = 0;
        this.mWxDao.friendCount = 0;
        data.MemberList.forEach((member) => {
            const userName = member.UserName;

            if (member.VerifyFlag & CODES.MM_USERATTRVERIFYFALG_BIZ_BRAND) {
                this.mWxDao.brandCount += 1;
                this.mWxDao.Brands.insert(member);
                return;
            }

            if (SP_ACCOUNTS.includes(userName) || /@qqim$/.test(userName)) {
                this.mWxDao.spCount += 1;
                this.mWxDao.SPs.insert(member);
                return;
            }

            if (userName.includes('@@')) {
                this.mWxDao.groupCount += 1;
                this.mWxDao.Groups.insert(member);
                return;
            }

            if (userName !== this.my.UserName) {
                this.mWxDao.friendCount += 1;
                this.mWxDao.Contacts.insert(member);
            }
        });

        log.I("wltest", `
        获取通讯录成功
        全部成员数: ${this.mWxDao.totalMemberCount}
        公众帐号数: ${this.mWxDao.brandCount}
        特殊帐号数: ${this.mWxDao.spCount}
        通讯录好友数: ${this.mWxDao.friendCount}
        加入的群聊数(不准确，只有把群聊加入通讯录才会在这里显示): ${this.mWxDao.groupCount}
      `);
    }

    async webwxsync() {
        let result;
        try {
            result = await req.post(
                URLS.API_webwxsync, {
                    BaseRequest: this.baseRequest,
                    SyncKey: this.syncKey,
                    rr: ~new Date,
                }, {
                    params: {
                        sid: this.sid,
                        skey: this.skey,
                        pass_ticket: this.passTicket,
                    },
                }
            );
        } catch (e) {
            log.I("wltest", 'webwxsync network error', e);
            await this.webwxsync();
            return;
        }

        const { data } = result;
        this.syncKey = data.SyncKey;
        this.formateSyncKey = this.syncKey.List.map((item) => item.Key + '_' + item.Val).join('|');
        data.AddMsgList.forEach((msg) => this.handleMsg(msg));
    }

    async handleMsg(msg) {
        //   log.I("wltest","-----------------msg-------------------");
        //   log.I("wltest",msg);

        if (msg.MsgType == '3') {
            msg.Content = "圖片.";
        } else if (msg.MsgType != '1' && msg.Content != '') {
            msg.Content = "暫不支持此類型消息.";
        }

        if (msg.FromUserName.includes('@@')) {
            const userId = msg.Content.match(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/)[1];
            msg.GroupMember = await this.getGroupMember(userId, msg.FromUserName);
            msg.Group = await this.getGroup(msg.FromUserName);
            msg.Content = msg.Content.replace(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/, '');
            // log.I("wltest",`
            //   来自群 ${msg.Group.NickName} 的消息
            //   ${msg.GroupMember.DisplayName || msg.GroupMember.NickName}: ${msg.Content}
            // `);
            // await this.mWxDao.insertMsg({WithUserName: msg.FromUserName,IsReceive: true,MsgType: msg.MsgType,Content: msg.Content,CreateTime: msg.CreateTime,IsGroup: true,GroupMember: msg.GroupMember});
            this.msgInsert({ WithUserName: msg.FromUserName, IsReceive: true, MsgType: msg.MsgType, Content: msg.Content, CreateTime: msg.CreateTime, IsGroup: true, GroupMember: msg.GroupMember });
            this.emit('group', msg);
            return;
        }



        if (msg.StatusNotifyUserName && !this.isGetRecentContacts) {
            this.chatSet = msg.StatusNotifyUserName;
            this.emit('u_contacts', "");
            this.isGetRecentContacts = true;
            console.log("this.chatSet:" + this.chatSet);
        }

        msg.Member = await this.getMember(msg.FromUserName);
        if (!msg.Member) return;
        // log.I("wltest",`
        //   新消息
        //   ${msg.Member.RemarkName || msg.Member.NickName}: ${msg.Content}
        // `);

        // 空消息，暂时不予理睬.
        if (msg.FromUserName == this.my.UserName && msg.Content == '') {
            return;
        }

        if (msg.FromUserName != this.my.UserName) {
            //   await this.mWxDao.insertMsg({WithUserName: msg.FromUserName,IsReceive: true,MsgType: msg.MsgType,Content: msg.Content,CreateTime: msg.CreateTime,IsGroup: false,GroupMember: ''});
            this.msgInsert({ WithUserName: msg.FromUserName, IsReceive: true, MsgType: msg.MsgType, Content: msg.Content, CreateTime: msg.CreateTime, IsGroup: false, GroupMember: '' });
        } else {
            this.msgInsert({ WithUserName: msg.ToUserName, IsReceive: false, MsgType: msg.MsgType, Content: msg.Content, CreateTime: msg.CreateTime, IsGroup: false, GroupMember: '' });
        }

        this.emit('friend', msg);
    }

    async fetchBatchgetContact(groupIds) {
        const list = groupIds.map((id) => ({ UserName: id, EncryChatRoomId: '' }));
        let result;
        try {
            result = await req.post(
                URLS.API_webwxbatchgetcontact, {
                    BaseRequest: this.baseRequest,
                    Count: list.length,
                    List: list,
                }, {
                    params: {
                        type: 'ex',
                        r: +new Date,
                    },
                }
            );
        } catch (e) {
            log.I("wltest", 'fetch batchgetcontact network error', e);
            // network error retry
            await this.fetchBatchgetContact(groupIds);
            return;
        }

        const { data } = result;

        // log.I("wltest",'fetchBatchgetContact groupIds = ' + groupIds);
        // log.I("wltest",result);

        if (!data || !data.BaseResponse || data.BaseResponse.Ret !== 0) {
            throw new Error('Fetch batchgetcontact fail');
        }

        // log.I("wltest",'data\n');
        // log.I("wltest",data);

        data.ContactList.forEach((Group) => {
            this.mWxDao.Groups.insert(Group);
            // log.I("wltest",`获取到群: ${Group.NickName}`);
            // log.I("wltest",`群 ${Group.NickName} 成员数量: ${Group.MemberList.length}`);
            const { MemberList } = Group;
            MemberList.forEach((member) => {
                this.mWxDao.updateGroupMembers({
                    UserName: member.UserName,
                    GroupUserName: member.GroupUserName,
                }, member);
            });
        });
    }

    async getMember(id) {
        // GetMambers From DB.
        const member = await this.mWxDao.getMember(id);
        return member;
    }

    async getGroup(groupId) {
        // GetGroup From DB.
        let group = await this.mWxDao.getGroup(groupId);
        if (group) return group;
        try {
            await this.fetchBatchgetContact([groupId]);
        } catch (e) {
            log.I("wltest", 'fetchBatchgetContact error', e);
            return null;
        }
        group = this.mWxDao.getGroup(groupId);
        return group;
    }

    async getGroupMember(id, groupId) {
        let member = await this.mWxDao.getGroupMember(id);
        if (member) return member;
        try {
            await this.fetchBatchgetContact([groupId]);
        } catch (e) {
            log.I("wltest", 'fetchBatchgetContact error', e);
            return null;
        }
        member = await this.mWxDao.getGroupMember(id);
        return member;
    }

    /*
  	async run() {
  		this.initConfig();
  	    try {
  	      this.uuid = await this.fetchUUID();
  	    } catch (e) {
  	      log.I("wltest",'fetch uuid error', e);
  	      // this.init();
  	      return;
  	    }
      	this.showQRCODE();
      	log.I("wltest",'请在手机端扫码绑定...');

      	// let login = await this.checkLoginStep();
  	    this.checkTimes = 0;
  	    while (true) {
  	      const loginCode = await this.checkLoginStep();
  	      if (loginCode === 200) break;

  	      if (loginCode !== 201) this.checkTimes += 1;

  	      if (this.checkTimes > 6) {
  	        log.I("wltest",'检查登录状态次数超出限制，重新获取二维码');
  	        this.init();
  	        return;
  	      }
  	    }
  	    await this.fetchTickets();

  	    await this.webwxinit();

  	    log.I("wltest",'初始化成功!');

  	    try {
  	      log.I("wltest",'正在通知客户端网页端已登录...');
  	      await this.notifyMobile();
  	      log.I("wltest",'正在获取通讯录列表...');
  	      await this.fetchContact();
  	    } catch (e) {

  	    }

  	    this.pushHost = await this.lookupSyncCheckHost();
      	URLS = getUrls({ baseHost: this.baseHost, pushHost: this.pushHost });
      	this.syncCheck();
        this.loop();
  	}
    */

    async doRun() {
        log.I("wltest", "doRun");
        if (fs.existsSync(secretPath)) {
            this.initConfig();
            const secret = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
            Object.assign(this, secret);
            this.loop();
        } else {
            this.init();
        }
    }

    async init() {
        log.I("wltest", "init");
        this.initConfig();
        try {
            this.uuid = await this.fetchUUID();
        } catch (e) {
            log.I("wltest", 'fetchUUID Error', e);
            this.init();
            return;
        }

        if (!this.uuid) {
            log.I("wltest", '获取 uuid 失败，正在重试...');
            this.init();
            return;
        }

        this.showQRCODE();
        log.I("wltest", '请在手机端扫码绑定...');

        // const qrcodeUrl = URLS.QRCODE_PATH + this.uuid;
        // this.emit('qrcode', qrcodeUrl);

        // limit check times
        this.checkTimes = 0;
        while (true) {
            const loginCode = await this.checkLoginStep();
            if (loginCode === 200) break;

            if (loginCode !== 201) this.checkTimes += 1;

            if (this.checkTimes > 6) {
                log.I("wltest", '检查登录状态次数超出限制，重新获取二维码');
                this.init();
                return;
            }
        }

        try {
            log.I("wltest", '正在获取凭据...');
            await this.fetchTickets();
            log.I("wltest", '获取凭据成功!');
        } catch (e) {
            log.I("wltest", '鉴权失败，正在重新登录...', e);
            this.init();
            return;
        }
        this.loop();
    }

    async loop() {
        log.I("wltest", '正在初始化参数...');
        try {
            await this.webwxinit();
        } catch (e) {
            log.I("wltest", '登录信息已失效，正在重新获取二维码...');
            this.init();
            return;
        }

        log.I("wltest", '初始化成功!');

        try {
            // log.I("wltest",'正在通知客户端网页端已登录...');
            await this.notifyMobile();

            log.I("wltest", '正在获取通讯录列表...');
            await this.fetchContact();
        } catch (e) {
            log.I("wltest", '初始化信息失败，正在重试');
            this.loop();
        }

        // log.I("wltest",'通知成功!');
        // log.I("wltest",'获取通讯录列表成功!');

        this.pushHost = await this.lookupSyncCheckHost();

        URLS = getUrls({ baseHost: this.baseHost, pushHost: this.pushHost });


        log.I("wltest", '循环读取信息......');

        this.syncCheck();
        this.isReady = true;
        this.emit("looped", "");
        // auto update Contacts every ten minute
        // this.updataContactTimer = setInterval(() => {
        //   this.updateContact();
        // },  1000 * 60 * 10);
    }

    msgInsert(info) {
        log.I("wltest", 'MsgInsert.');
        this.mWxDao.insertMsg(info).then((ret) => {
            log.I("wltest", 'emit msg....');
            this.emit("msg", info);
        });
    }

    sendText(to, content, callback) {
        const clientMsgId = (+new Date + Math.random().toFixed(3)).replace('.', '');
        req.post(URLS.API_webwxsendmsg, {
            BaseRequest: this.baseRequest,
            Msg: {
                Type: CODES.MSGTYPE_TEXT,
                Content: content,
                FromUserName: this.my.UserName,
                ToUserName: to,
                LocalID: clientMsgId,
                ClientMsgId: clientMsgId,
            },
        }, {
            params: {
                pass_ticket: this.passTicket,
            },
        }).then((result) => {
            const { data } = result;
            callback = callback || (() => (null));
            if (!data || !data.BaseResponse || data.BaseResponse.Ret !== 0) {
                return callback(new Error('Send text fail'));
            }
            this.msgInsert({ WithUserName: to, IsReceive: false, MsgType: 1, Content: content, CreateTime: 12351235, IsGroup: false, GroupMember: '' });
            callback();
        }).catch((e) => {
            // network error, retry
            this.sendText(to, content, callback);
            return;
        });
    }

    getHeadimg(name, callback) {
        req.request({
            // url: URLS.API_webwxgeticon,
            url: URLS.API_webwxgetheadimg,
            method: 'get',
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2652.0 Safari/537.36',
            },
            params: {
                seq: +new Date,
                username: name,
                skey: this.skey,
            }
        }).then((result) => {
            const { data } = result;
            callback = callback || (() => (null));
            let path = "/opt/data/share/LanyouWx.yunos.com/" + "_" + name + ".jpg";
            fs.writeFile(path, data, "binary", function (err) {
                if (err) {
                    callback(null);
                } else {
                    callback(path);
                }
            });
        }).catch((e) => {
            return;
        });
    }

    isLooped() {
        return this.isReady;
    }

    async getRecentContacts() {
        let _chatArr = this.chatSet.trim().split(",");

        function startsWith(searchString, starts) {
            return searchString.indexOf(starts, 0) === 0;
        }
        log.I("wltest", "getRecentContacts _chatArr.length = " + _chatArr.length);
        var i = _chatArr.length;
        while (i--) {
            if (!startsWith(_chatArr[i].toString(), "@")) {
                _chatArr.splice(i, 1);
            }
        }
        let contacts = new Array();
        for (var i = 0; i < _chatArr.length; i++) {

            let member = null;
            if (startsWith(_chatArr[i], "@@")) {
                member = await this.getGroup(_chatArr[i]);
            } else {
                member = await this.getMember(_chatArr[i]);
            }
            // 1.好友 2.群组 3.公众号
            if (member != null) {
                let contact = new Contact();
                contact.setUserName(member.UserName);
                if (member.RemarkName !== '') {
                    contact.setName(member.RemarkName);
                } else {
                    contact.setName(member.NickName);
                }
                contacts.push(contact);
            }
        }
        return contacts;
    }

    async getMsgListByWithUserName(pWithUserName) {
        let ret = await this.mWxDao.getMsgList(pWithUserName);
        return ret;
    }
}


module.exports = WxModule;
