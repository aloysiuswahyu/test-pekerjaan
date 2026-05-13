<?php

namespace App\Validation;

class EmployeeValidation
{
    // public function custom_rule(): bool
    // {
    //     return true;
    // }
    public function store()
    {
        return [
            'name' => [
                'rules' => 'required|min_length[3]|max_length[100]',
                'errors' => [
                    'required' => 'nama wajib diisi',
                ],
            ],

            'position' => [
                'rules' => 'required',
                'errors' => [
                    'required' => 'Posisi wajib diisi',
                ],
            ],
            'photo' => [
                'rules' => 'required',
                'errors' => [
                    'required' => 'Photo wajib diisi',
                ],
            ],
        ];
    }
    /*
    |--------------------------------------------------------------------------
    | UPDATE RULES
    |--------------------------------------------------------------------------
    */

    public function update($id)
    {
        return [
            'name' => [
                'rules' => 'required|min_length[3]|max_length[100]',
                'errors' => [
                    'required' => 'Nama wajib diisi',
                ],
            ],
            'nip' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required' => 'NIP wajib diisi',
                ],
            ],

            'jabatan' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required' => 'Jabatan wajib diisi',
                ],
            ],
            'photo' => [
                'rules' => 'required',
                'errors' => [
                    'required' => 'Photo wajib diisi',
                ],
            ],
        ];
    }
}
