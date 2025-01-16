# 宠物之家后端接口文档 v1.0

## 1. 用户模块
### 1.1 用户注册
```
POST /api/user/register
Request:
{
    "phone": string,     // 手机号
    "password": string,  // 密码(加密后)
    "code": string      // 验证码
}
Response:
{
    "code": 0,          // 0成功,非0失败
    "message": string,  // 响应信息
    "data": {
        "token": string,  // 登录凭证
        "userId": number  // 用户ID
    }
}
```

### 1.2 用户登录
```
POST /api/user/login
Request:
{
    "loginType": string,  // phone-手机号,password-密码
    "phone": string,      // 手机号
    "password": string,   // 密码(加密后,密码登录时必填)
    "code": string       // 验证码(手机号登录时必填)
}
Response:
{
    "code": 0,
    "message": string,
    "data": {
        "token": string,
        "userId": number,
        "userName": string,
        "avatar": string
    }
}
```

### 1.3 发送验证码
```
POST /api/user/sendCode
Request:
{
    "phone": string,    // 手机号
    "type": string     // register-注册,login-登录
}
Response:
{
    "code": 0,
    "message": string
}
```

## 2. 宠物管理模块
### 2.1 获取宠物列表
```
GET /api/pets
Request:
{
    "userId": number    // 用户ID
}
Response:
{
    "code": 0,
    "message": string,
    "data": [{
        "id": number,
        "name": string,
        "breed": string,
        "age": string,
        "gender": string,
        "status": string,
        "image": string,
        "isLost": boolean,
        "lostInfo": {
            "lostTime": string,
            "location": string,
            "description": string,
            "contact": string,
            "reward": number,
            "reportTime": string
        },
        "healthRecords": [{
            "id": number,
            "type": string,
            "date": string,
            "title": string,
            "description": string,
            "hospital": string,
            "cost": number
        }]
    }]
}
```

### 2.2 添加宠物
```
POST /api/pets
Request:
{
    "userId": number,
    "name": string,
    "breed": string,
    "age": string,
    "gender": string,
    "status": string,
    "image": string    // 图片URL
}
Response:
{
    "code": 0,
    "message": string,
    "data": {
        "id": number   // 新增宠物ID
    }
}
```

### 2.3 更新宠物信息
```
PUT /api/pets/{petId}
Request:
{
    "name": string,
    "breed": string,
    "age": string,
    "gender": string,
    "status": string,
    "image": string
}
Response:
{
    "code": 0,
    "message": string
}
```

### 2.4 删除宠物
```
DELETE /api/pets/{petId}
Response:
{
    "code": 0,
    "message": string
}
```

## 3. 健康档案模块
### 3.1 添加健康记录
```
POST /api/pets/{petId}/health-records
Request:
{
    "type": string,      // 体检/疫苗/驱虫/治疗/手术
    "date": string,      // YYYY-MM-DD
    "title": string,
    "description": string,
    "hospital": string,
    "cost": number
}
Response:
{
    "code": 0,
    "message": string,
    "data": {
        "id": number    // 新增记录ID
    }
}
```

### 3.2 获取健康记录列表
```
GET /api/pets/{petId}/health-records
Request:
{
    "type": string,     // 可选,记录类型筛选
    "year": number      // 可选,年份筛选
}
Response:
{
    "code": 0,
    "message": string,
    "data": [{
        "id": number,
        "type": string,
        "date": string,
        "title": string,
        "description": string,
        "hospital": string,
        "cost": number
    }]
}
```

## 4. 宠物挂失模块
### 4.1 发布挂失
```
POST /api/pets/{petId}/lost-report
Request:
{
    "lostTime": string,     // YYYY-MM-DD HH:mm
    "location": string,
    "description": string,
    "contact": string,
    "reward": number
}
Response:
{
    "code": 0,
    "message": string
}
```

### 4.2 取消挂失
```
DELETE /api/pets/{petId}/lost-report
Response:
{
    "code": 0,
    "message": string
}
```

## 5. 文件上传
### 5.1 上传图片
```
POST /api/upload/image
Request:
{
    "file": File,          // 图片文件
    "type": string        // pet-宠物图片
}
Response:
{
    "code": 0,
    "message": string,
    "data": {
        "url": string     // 图片访问URL
    }
}
```

## 6. 通用响应格式
```
{
    "code": number,     // 0表示成功,非0表示失败
    "message": string,  // 响应信息
    "data": object     // 响应数据,可选
}
```

## 7. 错误码说明
```
0    - 成功
1001 - 参数错误
1002 - 未登录或登录已过期
1003 - 权限不足
2001 - 用户不存在
2002 - 密码错误
2003 - 验证码错误
3001 - 宠物不存在
3002 - 无权操作该宠物
4001 - 文件上传失败
5001 - 服务器内部错误
``` 