<?php

namespace App\Validation;

class UserValidation
{
    // public function custom_rule(): bool
    // {
    //     return true;
    // }
    public function store()
    {
        return [
            'name' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required' => 'Nama wajib diisi',
                    'max_length' => 'Nama maksimal 100 karakter',
                ]],
            'username' => [
                'rules' => 'required|min_length[3]|max_length[100]|is_unique[users.username]',
                'errors' => [
                    'required' => 'Username wajib diisi',
                    'min_length' => 'Username minimal 3 karakter',
                    'max_length' => 'Username maksimal 100 karakter',
                    'is_unique' => 'Username sudah digunakan',
                ]],
            'password' => [
                'rules' => 'required|min_length[6]',
                'errors' => [
                    'required' => 'Password wajib diisi',
                    'min_length' => 'Password minimal 6 karakter',
                ],
            ]];
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
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required' => 'Nama wajib diisi',
                    'max_length' => 'Nama maksimal 100 karakter',
                ]],
            'username' => [
                'rules' => "required|min_length[3]|max_length[100]|is_unique[users.username,id,{$id}]",
                'errors' => [
                    'required' => 'Username wajib diisi',
                    'min_length' => 'Username minimal 3 karakter',
                    'max_length' => 'Username maksimal 100 karakter',
                    'is_unique' => 'Username sudah digunakan',
                ]],
            'password' => [
                'rules' => 'permit_empty|min_length[6]',
                'errors' => [
                    'min_length' => 'Password minimal 6 karakter',
                ]]];
    }
}
