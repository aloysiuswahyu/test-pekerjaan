<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Validation\UserValidation;

class UserController extends BaseController
{
    protected $model;
    protected $validation;
    protected $db;

    public function __construct()
    {
        $this->model = new UserModel();
        $this->validation = new UserValidation();
        $this->db = \Config\Database::connect();
    }

    /*
    |--------------------------------------------------------------------------
    | GET ALL USERS
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        try {
            $users = $this->model->paginate(10);

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'Data user berhasil diambil',
                'data' => $users,
                'pager' => [
                    'currentPage' => $this->model->pager->getCurrentPage(),
                    'totalPage' => $this->model->pager->getPageCount(),
                    'perPage' => $this->model->pager->getPerPage(),
                    'total' => $this->model->pager->getTotal(),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DETAIL USER
    |--------------------------------------------------------------------------
    */
    public function show($id = null)
    {
        try {
            $user = $this->model->find($id);
            if (!$user) {
                return $this->response->setStatusCode(404)->setJSON([
                    'status' => false,
                    'message' => 'User tidak ditemukan',
                    'data' => null,
                ]);
            }

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'User ditemukan',
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ]);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Create USER
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        $data = $this->request->getJSON(true);

        $rules = $this->validation->store();
        $validation = \Config\Services::validation();
        if (!$validation->setRules($rules)->run($data)) {
            return $this->response->setStatusCode(422)->setJSON(
                [
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validation->getErrors(),
                ]
            );
        }
        $this->db->transBegin();
        try {
            $data = [
                'username' => $data['username'],
                'password' => password_hash(
                    $data['password'],
                    PASSWORD_DEFAULT
                ),
            ];

            $user = $this->model->save($data);
            if (!$user) {
                $this->db->transRollback();

                return $this->response->setStatusCode(500)->setJSON([
                    'status' => false,
                    'message' => 'Gagal menyimpan user',
                    'errors' => $this->model->errors(),
                ]);
            }

            if ($this->db->transStatus() === false) {
                $this->db->transRollback();

                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Gagal menyimpan user',
                        'data' => null,
                    ]);
            }
            $this->db->transCommit();

            return $this->response->setStatusCode(201)->setJSON([
                'status' => true,
                'message' => 'User berhasil ditambahkan',
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            $this->db->transRollback();

            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ]);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | UPDATE USER
    |--------------------------------------------------------------------------
    */

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        $rules = $this->validation->update($id);
        $validation = \Config\Services::validation();
        if (!$validation->setRules($rules)->run($data)) {
            return $this->response->setStatusCode(422)->setJSON(
                [
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validation->getErrors(),
                ]
            );
        }

        $this->db->transBegin();

        try {
            $user = $this->model->find($id);

            if (!$user) {
                return $this->response->setStatusCode(404)->setJSON([
                    'status' => false,
                    'message' => 'User tidak ditemukan',
                    'data' => null,
                ]);
            }

            if (!empty($this->request->getRawInput()['password'])) {
                $data['password'] = password_hash(
                    $this->request->getRawInput()['password'],
                    PASSWORD_DEFAULT
                );
            }

            $this->model->update($id, $data);

            if ($this->db->transStatus() === false) {
                $this->db->transRollback();

                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Gagal mengubah user',
                        'data' => null,
                    ]);
            }
            $this->db->transCommit();

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'User berhasil diupdate',
                'data' => null,
            ]);
        } catch (\Exception $e) {
            $this->db->transRollback();

            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ]);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | DELETE USER
    |--------------------------------------------------------------------------
    */

    public function delete($id = null)
    {
        $this->db->transBegin();
        try {
            $user = $this->model->find($id);

            if (!$user) {
                return $this->response->setStatusCode(404)->setJSON([
                    'status' => false,
                    'message' => 'User tidak ditemukan',
                    'data' => null,
                ]);
            }

            $this->model->delete($id);

            if ($this->db->transStatus() === false) {
                $this->db->transRollback();

                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Gagal menghapus user',
                        'data' => null,
                    ]);
            }
            $this->db->transCommit();

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'User berhasil dihapus',
                'data' => null,
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ]);
        }
    }
}
