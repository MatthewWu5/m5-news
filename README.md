# Note:
- [x] 1. A big problem, how to debug vue project, it's very important some console log cannot display in chrome console
  - currently only chrome extension vue-devtool can be used, and you can learn how to use source-map: http://www.cnblogs.com/fsjohnhuang/p/4208566.html
http://blog.allenm.me/2012/12/whats-sourcemap/
- [ ] 2. Webpack principle, how to run project
- [ ] 3. Know all mode of vue-cli, dev or release or any other one
- [x] 4.Call third-party API
  - cross domain use jsonp in vue-resource (in c1.vue)
  - [ ] 4.1 What's axios 
- [ ] 5.How to write a back-end and call db
  - [ ] How to run webpack HMR in server side https://segmentfault.com/a/1190000003888845?utm_source=tuicool&utm_medium=referral
  - Folk a demo https://github.com/MatthewWu5/minimal-webpack-nodejs-hmr
- [ ] 6.Build a running environment on cloud
- [ ] 7. How to use sourcemap in config file
- [ ] 8. How to use ES6 in nodejs server
- [ ] 9. How to hide the warning log in console

why import in main.js but cannot use it in components

computed is before mounted 

竟然不支持箭头函数？？？，使用箭头函数将导致this取不到值
OnResetSearch: function () {
      var self = this;
      this.$nextTick(function () {
        self.searchKey = '';
      })
    }
    
# How to push code without input user psd:
 - 在windows中添加一个HOME环境变量，变量名:HOME,变量值：%USERPROFILE%
 - 进入%HOME%目录(users/yourUser)，新建一个名为"_netrc"的文件，文件中内容格式如下：
machine github.com
login MatthewWu5
password my-password

# Fetch code in bash step:
 - git clone https://github.com/MatthewWu5/project-test.git
# Commit and Push
 - git config --global user.name "MatthewWu5" 
 - git config --global user.email "123456789@gmail.com"
 - git commit -m "commit by git bush"
 - git push -u origin master

创建 git 仓库:

mkdir wap
cd wap
git init
touch README.md
git add README.md
git commit -m "first commit"
git remote add origin https://git.oschina.net/name/package.git
git push -u origin master

 # The football news revision (Write a football news web app by call zhibo8's web request)
 - Requirements
 - 1.Only display what you want to see,
 - 2.Sort the news by user comments' count,
 - 3.Add comments with different team's fans hahahahahahaha
 - 4.Use python to find out the history

 # So does weibo have some api? 
 - if exist, write a web app, you can see what you want, only positive or negative, block those fucking, SB star
 - I have found some nodeapi and a vue project about weibo in github, so maybe i can make it.

