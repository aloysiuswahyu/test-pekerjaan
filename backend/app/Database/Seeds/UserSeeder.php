<?php

namespace App\Database\Seeds;

use App\Models\UserModel;
use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    
    public function run()
    {
        $model = new UserModel();

        $data = [

            'username' => 'admin',

            'password' => password_hash(
                '4dm1n123#',
                PASSWORD_DEFAULT
            ),

            'created_at' => date('Y-m-d H:i:s'),

            'updated_at' => date('Y-m-d H:i:s'),

        ];

        $user = $model
            ->where('username', $data['username'])
            ->first();

        if ($user) {
            $model->update($user['id'], [
                'password' => $data['password'],
            ]);

            return;
        }

        $model->insert($data);
    }
}