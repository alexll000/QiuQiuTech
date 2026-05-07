# Roles And Permissions

## 1. 角色目标

QiuQiuTech 不是开放社区，角色需要围绕：

- 浏览
- 投稿
- 发布合作需求
- 审核
- 管理

五种能力来分。

## 2. 建议角色

### Visitor

游客。

可做：

- 浏览首页
- 浏览内容、事件、玩法、专题
- 浏览合作需求公开信息

不可做：

- 投稿
- 发布合作需求
- 收藏
- 申请联系

### Member

普通注册用户。

可做：

- 收藏内容
- 提交投稿
- 发布合作需求
- 申请联系
- 管理自己的资料

不可做：

- 审核内容
- 审核合作需求
- 修改展示位

### Verified Member

已认证用户。

在普通用户基础上增加：

- 更高可信度
- 可展示认证标识
- 某些合作卡可开放更高可见度

### Operator

运营 / 审核人员。

可做：

- 审核投稿
- 审核合作需求
- 编辑内容
- 管理专题
- 配置展示位
- 维护标签与分类

不可做：

- 系统级配置
- 全量权限管理

### Admin

管理员。

可做：

- 系统设置
- 用户管理
- 角色与权限
- 所有内容与合作数据管理
- Dashboard 配置

## 3. 集合权限建议

## `contents`

- Visitor: read published only
- Member: read published only
- Operator: create / update / publish
- Admin: full access

## `submissions`

- Member: create, read own, update own draft
- Operator: read all, review all
- Admin: full access

## `events`

- Visitor: read published
- Operator: create / update / publish
- Admin: full access

## `playbooks`

- Visitor: read published
- Operator: create / update / publish
- Admin: full access

## `topics`

- Visitor: read published
- Operator: create / update / manage associations
- Admin: full access

## `partnership_requests`

- Member: create own, update own draft / own active items
- Operator: review and publish
- Admin: full access

## `match_applications`

- Member: create, read own
- Operator: review and change status
- Admin: full access

## `placements`

- Visitor / Member: no access
- Operator: read / update
- Admin: full access

## `sources`

- Operator: manage
- Admin: full access

## 4. 审核动作建议

### 投稿审核动作

- approve
- reject
- request_revision
- publish
- archive

### 合作需求审核动作

- approve
- reject
- publish
- pause
- close

## 5. 前台权限联动

### 游客

看到：

- 内容
- 专题
- 合作需求公开部分

不能做：

- 投稿
- 收藏
- 申请联系

### 登录用户

可以：

- 收藏
- 投稿
- 发布合作需求
- 申请联系

### 认证用户

额外：

- 显示认证标识
- 更高可信展示

## 6. 第一阶段实现建议

第一阶段不要把权限做得过细。

先做这 5 档：

1. visitor
2. member
3. verified_member
4. operator
5. admin

后面再细拆。
