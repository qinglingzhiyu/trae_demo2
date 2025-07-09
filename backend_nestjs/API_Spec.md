# 医疗系统后端 API 规范文档

## 概述

本文档描述了医疗系统后端服务的 RESTful API 接口规范，基于 OpenAPI 3.0 标准。

## 服务器信息

- **开发环境**: `http://localhost:3000/api/v1`
- **测试环境**: `https://api-test.medical-system.com/api/v1`
- **生产环境**: `https://api.medical-system.com/api/v1`

## 认证方式

本 API 使用 JWT (JSON Web Token) 进行身份认证。

### 获取访问令牌

通过登录接口获取 JWT 令牌：

```http
POST /auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "password123"
}
```

### 使用访问令牌

在需要认证的请求头中携带令牌：

```http
Authorization: Bearer <your-jwt-token>
```

## OpenAPI 3.0 规范

```yaml
openapi: 3.0.3
info:
  title: 医疗系统后端 API
  description: 医疗系统后端服务的 RESTful API 接口
  version: 1.0.0
  contact:
    name: 医疗系统开发团队
    email: dev@medical-system.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/api/v1
    description: 开发环境
  - url: https://api-test.medical-system.com/api/v1
    description: 测试环境
  - url: https://api.medical-system.com/api/v1
    description: 生产环境

security:
  - bearerAuth: []

paths:
  # 认证相关接口
  /auth/login:
    post:
      tags:
        - 认证管理
      summary: 用户登录
      description: 使用手机号和密码进行用户登录
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginDto'
      responses:
        '200':
          description: 登录成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    description: JWT 访问令牌
                  user:
                    $ref: '#/components/schemas/UserEntity'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '400':
          $ref: '#/components/responses/BadRequest'

  /auth/register:
    post:
      tags:
        - 认证管理
      summary: 用户注册
      description: 注册新用户账号
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterDto'
      responses:
        '201':
          description: 注册成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    description: JWT 访问令牌
                  user:
                    $ref: '#/components/schemas/UserEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'

  /auth/profile:
    get:
      tags:
        - 认证管理
      summary: 获取当前用户信息
      description: 获取当前登录用户的详细信息
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserEntity'
        '401':
          $ref: '#/components/responses/Unauthorized'

  # 用户管理接口
  /users:
    get:
      tags:
        - 用户管理
      summary: 获取用户列表
      description: 分页获取用户列表，支持搜索和筛选
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - name: keyword
          in: query
          description: 搜索关键词（姓名、手机号）
          schema:
            type: string
        - name: role
          in: query
          description: 用户角色筛选
          schema:
            $ref: '#/components/schemas/UserRole'
        - name: status
          in: query
          description: 用户状态筛选
          schema:
            $ref: '#/components/schemas/UserStatus'
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedUsers'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      tags:
        - 用户管理
      summary: 创建用户
      description: 创建新用户（仅管理员）
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserDto'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '409':
          $ref: '#/components/responses/Conflict'

  /users/{id}:
    get:
      tags:
        - 用户管理
      summary: 获取用户详情
      description: 根据用户ID获取用户详细信息
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserEntity'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    patch:
      tags:
        - 用户管理
      summary: 更新用户信息
      description: 更新用户信息
      parameters:
        - $ref: '#/components/parameters/UserId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserDto'
      responses:
        '200':
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags:
        - 用户管理
      summary: 删除用户
      description: 删除用户（仅管理员）
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '200':
          description: 删除成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /users/statistics:
    get:
      tags:
        - 用户管理
      summary: 获取用户统计信息
      description: 获取用户数量统计信息
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserStatistics'
        '401':
          $ref: '#/components/responses/Unauthorized'

  # 就诊人管理接口
  /patients:
    get:
      tags:
        - 就诊人管理
      summary: 获取就诊人列表
      description: 分页获取就诊人列表
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - name: keyword
          in: query
          description: 搜索关键词（姓名、手机号）
          schema:
            type: string
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedPatients'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      tags:
        - 就诊人管理
      summary: 创建就诊人
      description: 为当前用户创建新的就诊人
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePatientDto'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PatientEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /patients/{id}:
    get:
      tags:
        - 就诊人管理
      summary: 获取就诊人详情
      description: 根据就诊人ID获取详细信息
      parameters:
        - $ref: '#/components/parameters/PatientId'
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PatientEntity'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    patch:
      tags:
        - 就诊人管理
      summary: 更新就诊人信息
      description: 更新就诊人信息
      parameters:
        - $ref: '#/components/parameters/PatientId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdatePatientDto'
      responses:
        '200':
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PatientEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags:
        - 就诊人管理
      summary: 删除就诊人
      description: 删除就诊人
      parameters:
        - $ref: '#/components/parameters/PatientId'
      responses:
        '200':
          description: 删除成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  # 订单管理接口
  /orders:
    get:
      tags:
        - 订单管理
      summary: 获取订单列表
      description: 分页获取订单列表，支持搜索和筛选
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - name: keyword
          in: query
          description: 搜索关键词（订单号、就诊人姓名）
          schema:
            type: string
        - name: status
          in: query
          description: 订单状态筛选
          schema:
            $ref: '#/components/schemas/OrderStatus'
        - name: orderType
          in: query
          description: 订单类型筛选
          schema:
            $ref: '#/components/schemas/OrderType'
        - name: patientId
          in: query
          description: 就诊人ID筛选
          schema:
            type: integer
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedOrders'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      tags:
        - 订单管理
      summary: 创建订单
      description: 创建新订单
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderDto'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /orders/{id}:
    get:
      tags:
        - 订单管理
      summary: 获取订单详情
      description: 根据订单ID获取详细信息
      parameters:
        - $ref: '#/components/parameters/OrderId'
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderEntity'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    patch:
      tags:
        - 订单管理
      summary: 更新订单
      description: 更新订单信息
      parameters:
        - $ref: '#/components/parameters/OrderId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateOrderDto'
      responses:
        '200':
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderEntity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags:
        - 订单管理
      summary: 删除订单
      description: 删除订单（仅待处理状态）
      parameters:
        - $ref: '#/components/parameters/OrderId'
      responses:
        '200':
          description: 删除成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /orders/statistics:
    get:
      tags:
        - 订单管理
      summary: 获取订单统计信息
      description: 获取订单数量和金额统计信息
      responses:
        '200':
          description: 获取成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderStatistics'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    Page:
      name: page
      in: query
      description: 页码
      schema:
        type: integer
        minimum: 1
        default: 1
    
    Limit:
      name: limit
      in: query
      description: 每页数量
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10
    
    UserId:
      name: id
      in: path
      required: true
      description: 用户ID
      schema:
        type: integer
    
    PatientId:
      name: id
      in: path
      required: true
      description: 就诊人ID
      schema:
        type: integer
    
    OrderId:
      name: id
      in: path
      required: true
      description: 订单ID
      schema:
        type: integer

  schemas:
    # 枚举类型
    UserRole:
      type: string
      enum: [ADMIN, USER]
      description: 用户角色
    
    UserStatus:
      type: string
      enum: [ACTIVE, INACTIVE]
      description: 用户状态
    
    Gender:
      type: string
      enum: [MALE, FEMALE, OTHER]
      description: 性别
    
    OrderStatus:
      type: string
      enum: [PENDING, PROCESSING, COMPLETED, CANCELLED]
      description: 订单状态
    
    OrderType:
      type: string
      enum: [MEDICAL, HEALTH_CHECK, CONSULTATION]
      description: 订单类型

    # 认证相关
    LoginDto:
      type: object
      required: [phone, password]
      properties:
        phone:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
          example: '13800138000'
        password:
          type: string
          minLength: 6
          description: 密码
          example: 'password123'
    
    RegisterDto:
      type: object
      required: [name, phone, email, idCard, password, confirmPassword]
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 50
          description: 姓名
          example: '张三'
        phone:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
          example: '13800138000'
        email:
          type: string
          format: email
          description: 邮箱
          example: 'zhangsan@example.com'
        idCard:
          type: string
          pattern: '^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$'
          description: 身份证号
          example: '110101199001011234'
        password:
          type: string
          minLength: 6
          description: 密码
          example: 'password123'
        confirmPassword:
          type: string
          description: 确认密码
          example: 'password123'

    # 用户相关
    CreateUserDto:
      type: object
      required: [name, phone, email, idCard, password, role]
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 50
          description: 姓名
          example: '张三'
        phone:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
          example: '13800138000'
        email:
          type: string
          format: email
          description: 邮箱
          example: 'zhangsan@example.com'
        idCard:
          type: string
          pattern: '^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$'
          description: 身份证号
          example: '110101199001011234'
        password:
          type: string
          minLength: 6
          description: 密码
          example: 'password123'
        role:
          $ref: '#/components/schemas/UserRole'
    
    UpdateUserDto:
      type: object
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 50
          description: 姓名
        phone:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
        email:
          type: string
          format: email
          description: 邮箱
        idCard:
          type: string
          pattern: '^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$'
          description: 身份证号
        status:
          $ref: '#/components/schemas/UserStatus'
    
    UserEntity:
      type: object
      properties:
        id:
          type: integer
          description: 用户ID
          example: 1
        name:
          type: string
          description: 姓名
          example: '张三'
        phone:
          type: string
          description: 手机号
          example: '13800138000'
        email:
          type: string
          description: 邮箱
          example: 'zhangsan@example.com'
        idCard:
          type: string
          description: 身份证号
          example: '110101199001011234'
        role:
          $ref: '#/components/schemas/UserRole'
        status:
          $ref: '#/components/schemas/UserStatus'
        createdAt:
          type: string
          format: date-time
          description: 创建时间
        updatedAt:
          type: string
          format: date-time
          description: 更新时间

    # 就诊人相关
    CreatePatientDto:
      type: object
      required: [name, gender, birthday, phone, idCard, relationship]
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 50
          description: 姓名
          example: '李四'
        gender:
          $ref: '#/components/schemas/Gender'
        birthday:
          type: string
          format: date
          description: 生日
          example: '1990-01-01'
        phone:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
          example: '13900139000'
        idCard:
          type: string
          pattern: '^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$'
          description: 身份证号
          example: '110101199001011235'
        medicalInsurance:
          type: string
          description: 医保信息
          example: '城镇职工医保'
        relationship:
          type: string
          description: 与用户关系
          example: '本人'
        emergencyContact:
          type: string
          description: 紧急联系人
          example: '王五 13700137000'
        allergies:
          type: string
          description: 过敏史
          example: '青霉素过敏'
        medicalHistory:
          type: string
          description: 病史
          example: '高血压'
    
    UpdatePatientDto:
      type: object
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 50
          description: 姓名
        gender:
          $ref: '#/components/schemas/Gender'
        birthday:
          type: string
          format: date
          description: 生日
        phone:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
        idCard:
          type: string
          pattern: '^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$'
          description: 身份证号
        medicalInsurance:
          type: string
          description: 医保信息
        relationship:
          type: string
          description: 与用户关系
        emergencyContact:
          type: string
          description: 紧急联系人
        allergies:
          type: string
          description: 过敏史
        medicalHistory:
          type: string
          description: 病史
    
    PatientEntity:
      type: object
      properties:
        id:
          type: integer
          description: 就诊人ID
          example: 1
        userId:
          type: integer
          description: 用户ID
          example: 1
        name:
          type: string
          description: 姓名
          example: '李四'
        gender:
          $ref: '#/components/schemas/Gender'
        birthday:
          type: string
          format: date
          description: 生日
          example: '1990-01-01'
        phone:
          type: string
          description: 手机号
          example: '13900139000'
        idCard:
          type: string
          description: 身份证号
          example: '110101199001011235'
        medicalInsurance:
          type: string
          description: 医保信息
          example: '城镇职工医保'
        relationship:
          type: string
          description: 与用户关系
          example: '本人'
        emergencyContact:
          type: string
          description: 紧急联系人
          example: '王五 13700137000'
        allergies:
          type: string
          description: 过敏史
          example: '青霉素过敏'
        medicalHistory:
          type: string
          description: 病史
          example: '高血压'
        createdAt:
          type: string
          format: date-time
          description: 创建时间
        updatedAt:
          type: string
          format: date-time
          description: 更新时间

    # 订单相关
    CreateOrderItemDto:
      type: object
      required: [itemName, price, quantity]
      properties:
        itemName:
          type: string
          description: 服务项目名称
          example: '血常规检查'
        itemCode:
          type: string
          description: 服务项目代码
          example: 'BC001'
        price:
          type: number
          format: decimal
          minimum: 0
          description: 单价
          example: 50.00
        quantity:
          type: integer
          minimum: 1
          description: 数量
          example: 1
        category:
          type: string
          description: 服务类别
          example: '检验'
    
    CreateOrderDto:
      type: object
      required: [patientId, items]
      properties:
        patientId:
          type: integer
          description: 就诊人ID
          example: 1
        orderType:
          $ref: '#/components/schemas/OrderType'
        description:
          type: string
          description: 订单描述
          example: '常规体检'
        items:
          type: array
          items:
            $ref: '#/components/schemas/CreateOrderItemDto'
          description: 订单项目列表
    
    UpdateOrderDto:
      type: object
      properties:
        patientId:
          type: integer
          description: 就诊人ID
        orderType:
          $ref: '#/components/schemas/OrderType'
        description:
          type: string
          description: 订单描述
        status:
          $ref: '#/components/schemas/OrderStatus'
    
    OrderItemEntity:
      type: object
      properties:
        id:
          type: integer
          description: 订单项目ID
          example: 1
        orderId:
          type: integer
          description: 订单ID
          example: 1
        itemName:
          type: string
          description: 服务项目名称
          example: '血常规检查'
        itemCode:
          type: string
          description: 服务项目代码
          example: 'BC001'
        price:
          type: number
          format: decimal
          description: 单价
          example: 50.00
        quantity:
          type: integer
          description: 数量
          example: 1
        subtotal:
          type: number
          format: decimal
          description: 小计
          example: 50.00
        category:
          type: string
          description: 服务类别
          example: '检验'
        createdAt:
          type: string
          format: date-time
          description: 创建时间
        updatedAt:
          type: string
          format: date-time
          description: 更新时间
    
    OrderEntity:
      type: object
      properties:
        id:
          type: integer
          description: 订单ID
          example: 1
        orderNumber:
          type: string
          description: 订单号
          example: 'ORD1640995200000001'
        userId:
          type: integer
          description: 用户ID
          example: 1
        patientId:
          type: integer
          description: 就诊人ID
          example: 1
        orderType:
          $ref: '#/components/schemas/OrderType'
        status:
          $ref: '#/components/schemas/OrderStatus'
        description:
          type: string
          description: 订单描述
          example: '常规体检'
        totalAmount:
          type: number
          format: decimal
          description: 订单总金额
          example: 150.00
        createdAt:
          type: string
          format: date-time
          description: 创建时间
        updatedAt:
          type: string
          format: date-time
          description: 更新时间
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItemEntity'
          description: 订单项目列表
        patient:
          type: object
          description: 就诊人信息
        user:
          type: object
          description: 用户信息

    # 分页和统计
    PaginatedUsers:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/UserEntity'
        total:
          type: integer
          description: 总数量
        page:
          type: integer
          description: 当前页码
        limit:
          type: integer
          description: 每页数量
        totalPages:
          type: integer
          description: 总页数
    
    PaginatedPatients:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/PatientEntity'
        total:
          type: integer
          description: 总数量
        page:
          type: integer
          description: 当前页码
        limit:
          type: integer
          description: 每页数量
        totalPages:
          type: integer
          description: 总页数
    
    PaginatedOrders:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/OrderEntity'
        total:
          type: integer
          description: 总数量
        page:
          type: integer
          description: 当前页码
        limit:
          type: integer
          description: 每页数量
        totalPages:
          type: integer
          description: 总页数
    
    UserStatistics:
      type: object
      properties:
        total:
          type: integer
          description: 总用户数
        active:
          type: integer
          description: 活跃用户数
        inactive:
          type: integer
          description: 非活跃用户数
        admin:
          type: integer
          description: 管理员数
        user:
          type: integer
          description: 普通用户数
    
    OrderStatistics:
      type: object
      properties:
        total:
          type: integer
          description: 总订单数
        pending:
          type: integer
          description: 待处理订单数
        processing:
          type: integer
          description: 处理中订单数
        completed:
          type: integer
          description: 已完成订单数
        cancelled:
          type: integer
          description: 已取消订单数
        totalAmount:
          type: number
          format: decimal
          description: 总金额
    
    SuccessMessage:
      type: object
      properties:
        message:
          type: string
          description: 成功消息
          example: '操作成功'
    
    ErrorResponse:
      type: object
      properties:
        statusCode:
          type: integer
          description: HTTP状态码
        message:
          type: string
          description: 错误消息
        error:
          type: string
          description: 错误类型
        timestamp:
          type: string
          format: date-time
          description: 错误时间
        path:
          type: string
          description: 请求路径

  responses:
    BadRequest:
      description: 请求参数错误
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            statusCode: 400
            message: '请求参数错误'
            error: 'Bad Request'
            timestamp: '2023-12-01T10:00:00.000Z'
            path: '/api/v1/users'
    
    Unauthorized:
      description: 未授权
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            statusCode: 401
            message: '未授权访问'
            error: 'Unauthorized'
            timestamp: '2023-12-01T10:00:00.000Z'
            path: '/api/v1/users'
    
    Forbidden:
      description: 权限不足
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            statusCode: 403
            message: '权限不足'
            error: 'Forbidden'
            timestamp: '2023-12-01T10:00:00.000Z'
            path: '/api/v1/users'
    
    NotFound:
      description: 资源不存在
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            statusCode: 404
            message: '资源不存在'
            error: 'Not Found'
            timestamp: '2023-12-01T10:00:00.000Z'
            path: '/api/v1/users/999'
    
    Conflict:
      description: 资源冲突
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            statusCode: 409
            message: '手机号已存在'
            error: 'Conflict'
            timestamp: '2023-12-01T10:00:00.000Z'
            path: '/api/v1/users'
```

## 错误处理

### 标准错误响应格式

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "错误类型",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "path": "/api/v1/endpoint"
}
```

### 常见错误码

- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权访问
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `409 Conflict`: 资源冲突（如手机号已存在）
- `422 Unprocessable Entity`: 数据验证失败
- `429 Too Many Requests`: 请求频率超限
- `500 Internal Server Error`: 服务器内部错误

## 数据验证

### 手机号格式
- 正则表达式: `^1[3-9]\d{9}$`
- 示例: `13800138000`

### 身份证号格式
- 正则表达式: `^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$`
- 示例: `110101199001011234`

### 邮箱格式
- 标准邮箱格式验证
- 示例: `user@example.com`

## 分页参数

所有列表接口都支持分页参数：

- `page`: 页码，从1开始，默认为1
- `limit`: 每页数量，范围1-100，默认为10

## 搜索和筛选

支持的搜索和筛选参数：

- `keyword`: 关键词搜索（姓名、手机号等）
- `status`: 状态筛选
- `role`: 角色筛选
- `orderType`: 订单类型筛选

## 版本控制

当前 API 版本为 v1，通过 URL 路径进行版本控制：`/api/v1/`

## 联系方式

如有问题或建议，请联系开发团队：dev@medical-system.com