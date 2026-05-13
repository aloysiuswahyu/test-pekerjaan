<?php

namespace App\Controllers\Auth;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;

class AuthController extends BaseController
{
    public function login()
    {
       

        try{
          
            $model = new UserModel();
            $user = $model
                ->where(
                    'username',
                    $this->request->getJSON()->username
                )
                ->first();

            if (!$user) {

                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'status' => false,
                        'message' => 'User tidak ditemukan',
                         'data' => null
                    ]);
            }

            if (!password_verify(
                $this->request->getJSON()->password,
                $user['password']
            )) {

                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Password salah',
                         'data' => null
                    ]);
            }

            $key = getenv('JWT_SECRET');

            $payload = [
                'iss' => 'localhost',
                'aud' => 'localhost',
                'iat' => time(),
                'exp' => time() + 86400,
                'data' => [
                    'id' => $user['id'],
                    'username' => $user['username']
                ]

            ];

            $token = JWT::encode(
                $payload,
                $key,
                'HS256'
            );
            return $this->response->setStatusCode(200)->setJSON([

                'status' => true,
                'token' => $token,
                'type' => 'Bearer',
                'data' => [
                    'username' => $user['username']
                ]

            ]);
        }catch( \Exception $e){

            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $e->getMessage(),
                 'data' => null
            ]);
        }

    }

}
