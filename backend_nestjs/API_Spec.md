# API 接口定义文档

## 服务器信息

- **开发环境**: http://localhost:3000
- **测试环境**: https://api-test.example.com
- **生产环境**: https://api.example.com

## 认证方式

本API使用 **JWT (JSON Web Token)** 进行身份认证：

- **认证头**: `Authorization: Bearer <token>`
- **Token获取**: 通过登录接口获取
- **Token刷新**: 通过刷新接口更新
- **Token过期**: 默认24小时

## OpenAPI 3.0 规范

```yaml
openapi: 3.0.3
info:
  title: 系统管理 API
  description: 系统管理模块API接口文档，包括权限管理、系统参数、字典管理、操作日志、消息通知和数据备份等功能
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com

servers:
  - url: http://localhost:3000
    description: 开发环境
  - url: https://api-test.example.com
    description: 测试环境
  - url: https://api.example.com
    description: 生产环境

security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    # 通用响应结构
    ApiResponse:
      type: object
      properties:
        code:
          type: integer
          description: 响应状态码
          example: 200
        message:
          type: string
          description: 响应消息
          example: "操作成功"
        data:
          description: 响应数据
        timestamp:
          type: string
          format: date-time
          description: 响应时间

    PaginationResponse:
      allOf:
        - $ref: '#/components/schemas/ApiResponse'
        - type: object
          properties:
            data:
              type: object
              properties:
                items:
                  type: array
                  description: 数据列表
                total:
                  type: integer
                  description: 总记录数
                page:
                  type: integer
                  description: 当前页码
                pageSize:
                  type: integer
                  description: 每页数量
                totalPages:
                  type: integer
                  description: 总页数

    # 角色相关
    Role:
      type: object
      properties:
        id:
          type: integer
          description: 角色ID
        name:
          type: string
          description: 角色名称
        code:
          type: string
          description: 角色代码
        description:
          type: string
          description: 角色描述
        isEnabled:
          type: boolean
          description: 是否启用
        sortOrder:
          type: integer
          description: 排序
        createdAt:
          type: string
          format: date-time
          description: 创建时间
        updatedAt:
          type: string
          format: date-time
          description: 更新时间

    CreateRoleDto:
      type: object
      required:
        - name
        - code
      properties:
        name:
          type: string
          maxLength: 100
          description: 角色名称
        code:
          type: string
          maxLength: 50
          description: 角色代码
        description:
          type: string
          description: 角色描述
        isEnabled:
          type: boolean
          default: true
          description: 是否启用
        sortOrder:
          type: integer
          default: 0
          description: 排序

    # 权限相关
    Permission:
      type: object
      properties:
        id:
          type: integer
          description: 权限ID
        name:
          type: string
          description: 权限名称
        code:
          type: string
          description: 权限代码
        description:
          type: string
          description: 权限描述
        parentId:
          type: integer
          description: 父权限ID
        type:
          type: string
          enum: [MENU, BUTTON, API]
          description: 权限类型
        resource:
          type: string
          description: 资源路径
        action:
          type: string
          description: 操作动作
        isEnabled:
          type: boolean
          description: 是否启用
        sortOrder:
          type: integer
          description: 排序
        children:
          type: array
          items:
            $ref: '#/components/schemas/Permission'
          description: 子权限

    # 系统参数相关
    SystemParam:
      type: object
      properties:
        id:
          type: integer
          description: 参数ID
        paramKey:
          type: string
          description: 参数键名
        paramValue:
          type: string
          description: 参数值
        paramName:
          type: string
          description: 参数名称
        paramDescription:
          type: string
          description: 参数描述
        paramType:
          type: string
          enum: [STRING, NUMBER, BOOLEAN, JSON]
          description: 参数类型
        paramGroup:
          type: string
          description: 参数分组
        isSystem:
          type: boolean
          description: 是否为系统参数
        isEnabled:
          type: boolean
          description: 是否启用

    # 字典相关
    Dictionary:
      type: object
      properties:
        id:
          type: integer
          description: 字典ID
        dictType:
          type: string
          description: 字典类型
        dictName:
          type: string
          description: 字典名称
        description:
          type: string
          description: 字典描述
        isEnabled:
          type: boolean
          description: 是否启用
        items:
          type: array
          items:
            $ref: '#/components/schemas/DictionaryItem'
          description: 字典项列表

    DictionaryItem:
      type: object
      properties:
        id:
          type: integer
          description: 字典项ID
        itemLabel:
          type: string
          description: 字典项标签
        itemValue:
          type: string
          description: 字典项值
        description:
          type: string
          description: 字典项描述
        extraData:
          type: object
          description: 扩展数据
        isEnabled:
          type: boolean
          description: 是否启用

    # 操作日志相关
    AuditLog:
      type: object
      properties:
        id:
          type: integer
          description: 日志ID
        userId:
          type: integer
          description: 操作用户ID
        userName:
          type: string
          description: 操作用户名
        operationModule:
          type: string
          description: 操作模块
        operationAction:
          type: string
          description: 操作动作
        operationDescription:
          type: string
          description: 操作描述
        targetType:
          type: string
          description: 目标资源类型
        targetId:
          type: string
          description: 目标资源ID
        ipAddress:
          type: string
          description: IP地址
        operationResult:
          type: string
          enum: [SUCCESS, FAILED]
          description: 操作结果
        createdAt:
          type: string
          format: date-time
          description: 创建时间

    # 通知相关
    Notification:
      type: object
      properties:
        id:
          type: integer
          description: 通知ID
        title:
          type: string
          description: 通知标题
        content:
          type: string
          description: 通知内容
        type:
          type: string
          description: 通知类型
        level:
          type: string
          enum: [INFO, WARNING, ERROR, SUCCESS]
          description: 通知级别
        senderId:
          type: integer
          description: 发送者ID
        senderName:
          type: string
          description: 发送者姓名
        isRead:
          type: boolean
          description: 是否已读
        createdAt:
          type: string
          format: date-time
          description: 创建时间

    # 备份相关
    Backup:
      type: object
      properties:
        id:
          type: integer
          description: 备份ID
        name:
          type: string
          description: 备份名称
        description:
          type: string
          description: 备份描述
        type:
          type: string
          enum: [FULL, INCREMENTAL, DIFFERENTIAL]
          description: 备份类型
        status:
          type: string
          enum: [PENDING, RUNNING, COMPLETED, FAILED, CANCELLED]
          description: 备份状态
        fileSize:
          type: integer
          description: 文件大小(字节)
        duration:
          type: integer
          description: 耗时(秒)
        createdAt:
          type: string
          format: date-time
          description: 创建时间

paths:
  # 角色管理
  /api/system/roles:
    get:
      tags:
        - 角色管理
      summary: 获取角色列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
          description: 页码
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 10
          description: 每页数量
        - name: keyword
          in: query
          schema:
            type: string
          description: 搜索关键词
        - name: isEnabled
          in: query
          schema:
            type: boolean
          description: 是否启用
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          items:
                            type: array
                            items:
                              $ref: '#/components/schemas/Role'

    post:
      tags:
        - 角色管理
      summary: 创建角色
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRoleDto'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/Role'
        '400':
          description: 请求参数错误
        '409':
          description: 角色代码已存在

  /api/system/roles/{id}:
    get:
      tags:
        - 角色管理
      summary: 获取角色详情
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: 角色ID
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/Role'
        '404':
          description: 角色不存在

    put:
      tags:
        - 角色管理
      summary: 更新角色
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: 角色ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRoleDto'
      responses:
        '200':
          description: 更新成功
        '404':
          description: 角色不存在

    delete:
      tags:
        - 角色管理
      summary: 删除角色
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: 角色ID
      responses:
        '200':
          description: 删除成功
        '404':
          description: 角色不存在

  # 权限管理
  /api/system/permissions:
    get:
      tags:
        - 权限管理
      summary: 获取权限列表
      parameters:
        - name: type
          in: query
          schema:
            type: string
            enum: [MENU, BUTTON, API]
          description: 权限类型
        - name: parentId
          in: query
          schema:
            type: integer
          description: 父权限ID
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Permission'

  /api/system/permissions/tree:
    get:
      tags:
        - 权限管理
      summary: 获取权限树
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Permission'

  # 角色权限关联
  /api/system/roles/{roleId}/permissions:
    get:
      tags:
        - 角色管理
      summary: 获取角色权限
      parameters:
        - name: roleId
          in: path
          required: true
          schema:
            type: integer
          description: 角色ID
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          type: integer
                        description: 权限ID列表

    put:
      tags:
        - 角色管理
      summary: 分配角色权限
      parameters:
        - name: roleId
          in: path
          required: true
          schema:
            type: integer
          description: 角色ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                permissionIds:
                  type: array
                  items:
                    type: integer
                  description: 权限ID列表
      responses:
        '200':
          description: 分配成功

  # 系统参数管理
  /api/system/params:
    get:
      tags:
        - 系统参数
      summary: 获取系统参数列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 10
        - name: keyword
          in: query
          schema:
            type: string
          description: 搜索关键词
        - name: paramGroup
          in: query
          schema:
            type: string
          description: 参数分组
        - name: paramType
          in: query
          schema:
            type: string
            enum: [STRING, NUMBER, BOOLEAN, JSON]
          description: 参数类型
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          items:
                            type: array
                            items:
                              $ref: '#/components/schemas/SystemParam'

  /api/system/params/{key}:
    get:
      tags:
        - 系统参数
      summary: 根据键名获取参数值
      parameters:
        - name: key
          in: path
          required: true
          schema:
            type: string
          description: 参数键名
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: string
                        description: 参数值

  # 字典管理
  /api/system/dictionaries:
    get:
      tags:
        - 字典管理
      summary: 获取字典类型列表
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Dictionary'

  /api/system/dictionaries/{type}/items:
    get:
      tags:
        - 字典管理
      summary: 根据类型获取字典项
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
          description: 字典类型
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/DictionaryItem'

  # 操作日志
  /api/system/audit-logs:
    get:
      tags:
        - 操作日志
      summary: 获取操作日志列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 10
        - name: keyword
          in: query
          schema:
            type: string
          description: 搜索关键词
        - name: operationModule
          in: query
          schema:
            type: string
          description: 操作模块
        - name: operationAction
          in: query
          schema:
            type: string
          description: 操作动作
        - name: operationResult
          in: query
          schema:
            type: string
            enum: [SUCCESS, FAILED]
          description: 操作结果
        - name: startTime
          in: query
          schema:
            type: string
            format: date-time
          description: 开始时间
        - name: endTime
          in: query
          schema:
            type: string
            format: date-time
          description: 结束时间
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          items:
                            type: array
                            items:
                              $ref: '#/components/schemas/AuditLog'

    post:
      tags:
        - 操作日志
      summary: 创建操作日志
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - operationModule
                - operationAction
                - operationResult
              properties:
                userId:
                  type: integer
                  description: 操作用户ID
                operationModule:
                  type: string
                  description: 操作模块
                operationAction:
                  type: string
                  description: 操作动作
                operationDescription:
                  type: string
                  description: 操作描述
                targetType:
                  type: string
                  description: 目标资源类型
                targetId:
                  type: string
                  description: 目标资源ID
                operationResult:
                  type: string
                  enum: [SUCCESS, FAILED]
                  description: 操作结果
      responses:
        '201':
          description: 创建成功

  # 消息通知
  /api/system/notifications:
    get:
      tags:
        - 消息通知
      summary: 获取通知列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 10
        - name: type
          in: query
          schema:
            type: string
          description: 通知类型
        - name: level
          in: query
          schema:
            type: string
            enum: [INFO, WARNING, ERROR, SUCCESS]
          description: 通知级别
        - name: isRead
          in: query
          schema:
            type: boolean
          description: 是否已读
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          items:
                            type: array
                            items:
                              $ref: '#/components/schemas/Notification'

    post:
      tags:
        - 消息通知
      summary: 创建通知
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - content
                - type
                - level
                - receiverType
              properties:
                title:
                  type: string
                  maxLength: 200
                  description: 通知标题
                content:
                  type: string
                  description: 通知内容
                type:
                  type: string
                  description: 通知类型
                level:
                  type: string
                  enum: [INFO, WARNING, ERROR, SUCCESS]
                  description: 通知级别
                receiverType:
                  type: string
                  enum: [USER, ROLE, ALL]
                  description: 接收者类型
                receiverIds:
                  type: array
                  items:
                    type: integer
                  description: 接收者ID列表
      responses:
        '201':
          description: 创建成功

  /api/system/notifications/my:
    get:
      tags:
        - 消息通知
      summary: 获取我的通知
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 10
        - name: isRead
          in: query
          schema:
            type: boolean
          description: 是否已读
      responses:
        '200':
          description: 成功

  /api/system/notifications/{id}/read:
    put:
      tags:
        - 消息通知
      summary: 标记通知已读
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: 通知ID
      responses:
        '200':
          description: 标记成功

  # 数据备份
  /api/system/backups:
    get:
      tags:
        - 数据备份
      summary: 获取备份列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 10
        - name: type
          in: query
          schema:
            type: string
            enum: [FULL, INCREMENTAL, DIFFERENTIAL]
          description: 备份类型
        - name: status
          in: query
          schema:
            type: string
            enum: [PENDING, RUNNING, COMPLETED, FAILED, CANCELLED]
          description: 备份状态
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          items:
                            type: array
                            items:
                              $ref: '#/components/schemas/Backup'

    post:
      tags:
        - 数据备份
      summary: 创建备份任务
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - type
                - scope
                - compression
              properties:
                name:
                  type: string
                  maxLength: 200
                  description: 备份名称
                description:
                  type: string
                  description: 备份描述
                type:
                  type: string
                  enum: [FULL, INCREMENTAL, DIFFERENTIAL]
                  description: 备份类型
                scope:
                  type: array
                  items:
                    type: string
                  description: 备份范围
                compression:
                  type: string
                  enum: [ZIP, TAR, GZIP]
                  description: 压缩格式
                isEncrypted:
                  type: boolean
                  default: false
                  description: 是否加密
                password:
                  type: string
                  description: 备份密码
      responses:
        '201':
          description: 创建成功

  /api/system/backups/{id}/restore:
    post:
      tags:
        - 数据备份
      summary: 恢复数据
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: 备份ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                password:
                  type: string
                  description: 恢复密码
                scope:
                  type: array
                  items:
                    type: string
                  description: 恢复范围
                overwrite:
                  type: boolean
                  default: false
                  description: 是否覆盖现有数据
                backupCurrent:
                  type: boolean
                  default: true
                  description: 是否备份当前数据
      responses:
        '200':
          description: 恢复成功

  /api/system/backups/{id}/download:
    get:
      tags:
        - 数据备份
      summary: 下载备份文件
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: 备份ID
      responses:
        '200':
          description: 下载成功
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary

tags:
  - name: 角色管理
    description: 角色相关接口
  - name: 权限管理
    description: 权限相关接口
  - name: 系统参数
    description: 系统参数相关接口
  - name: 字典管理
    description: 字典相关接口
  - name: 操作日志
    description: 操作日志相关接口
  - name: 消息通知
    description: 消息通知相关接口
  - name: 数据备份
    description: 数据备份相关接口
```

## 错误码说明

| 错误码 | 说明 | 描述 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 创建成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权，需要登录 |
| 403 | Forbidden | 禁止访问，权限不足 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突，如重复创建 |
| 422 | Unprocessable Entity | 请求参数验证失败 |
| 500 | Internal Server Error | 服务器内部错误 |

## 请求示例

### 创建角色

```bash
curl -X POST http://localhost:3000/api/system/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "管理员",
    "code": "admin",
    "description": "系统管理员角色",
    "isEnabled": true,
    "sortOrder": 1
  }'
```

### 获取角色列表

```bash
curl -X GET "http://localhost:3000/api/system/roles?page=1&pageSize=10&keyword=管理" \
  -H "Authorization: Bearer <token>"
```

### 分配角色权限

```bash
curl -X PUT http://localhost:3000/api/system/roles/1/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "permissionIds": [1, 2, 3, 4, 5]
  }'
```

### 创建系统参数

```bash
curl -X POST http://localhost:3000/api/system/params \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "paramKey": "system.title",
    "paramValue": "系统管理平台",
    "paramName": "系统标题",
    "paramDescription": "系统首页显示的标题",
    "paramType": "STRING",
    "paramGroup": "基础配置"
  }'
```

### 发送通知

```bash
curl -X POST http://localhost:3000/api/system/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "系统维护通知",
    "content": "系统将于今晚22:00-24:00进行维护，请提前保存工作。",
    "type": "SYSTEM",
    "level": "WARNING",
    "receiverType": "ALL"
  }'
```

### 创建备份任务

```bash
curl -X POST http://localhost:3000/api/system/backups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "每日全量备份",
    "description": "每日凌晨自动全量备份",
    "type": "FULL",
    "scope": ["users", "roles", "permissions"],
    "compression": "GZIP",
    "isEncrypted": true,
    "password": "backup123"
  }'
```

## 响应示例

### 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "管理员",
    "code": "admin",
    "description": "系统管理员角色",
    "isEnabled": true,
    "sortOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "管理员",
        "code": "admin",
        "description": "系统管理员角色",
        "isEnabled": true,
        "sortOrder": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": {
    "errors": [
      {
        "field": "name",
        "message": "角色名称不能为空"
      },
      {
        "field": "code",
        "message": "角色代码不能为空"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 注意事项

1. **认证要求**: 除了公开接口外，所有接口都需要在请求头中携带有效的JWT Token
2. **权限控制**: 不同的接口需要不同的权限，请确保用户具有相应的操作权限
3. **参数验证**: 请求参数会进行严格验证，不符合要求的请求会返回400错误
4. **数据格式**: 所有时间字段均使用ISO 8601格式（YYYY-MM-DDTHH:mm:ss.sssZ）
5. **文件上传**: 备份文件等大文件操作可能需要较长时间，请设置合适的超时时间
6. **并发控制**: 某些操作（如数据备份恢复）不支持并发执行，请避免重复提交
7. **日志记录**: 所有重要操作都会记录到操作日志中，便于审计和追踪