<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\EmployeeModel;
use App\Validation\EmployeeValidation;

class EmployeeController extends BaseController
{
    protected $model;
    protected $validation;
    protected $db;

    public function __construct()
    {
        $this->model = new EmployeeModel();
        $this->validation = new EmployeeValidation();
        $this->db = \Config\Database::connect();
    }

    /*
    |--------------------------------------------------------------------------
    | GET ALL EMPLOYEE
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        try {
            $employees = $this->model->paginate(10);

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'Data employee berhasil diambil',
                'data' => $employees,
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
    | DETAIL EMPLOYEE
    |--------------------------------------------------------------------------
    */
    public function show($id = null)
    {
        try {
            $employee = $this->model->find($id);
            if (!$employee) {
                return $this->response->setStatusCode(404)->setJSON([
                    'status' => false,
                    'message' => 'Employee tidak ditemukan',
                    'data' => null,
                ]);
            }

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'data' => $employee,
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
    | Create EMPLOYEE
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        $rules = $this->validation->store();
        if (!$this->validate($rules)) {
            return $this->response->setStatusCode(422)->setJSON([
                'status' => false,
                'errors' => $this->validator->getErrors(),
                'data' => null,
            ]);
        }
        $this->db->transBegin();
        $imgName = '';
        try {
            // $img = $this->request->getFile('foto');

            // if ($img && $img->isValid()) {
            //     $imgName = $img->getRandomName();

            //     $img->move('uploads', $imgName);
            // }
            // echo '<pre>';
            // print_r([
            //     'name' => $this->request->getPost('name'),
            //     'nip' => $this->request->getPost('nip'),
            //     'jabatan' => $this->request->getPost('jabatan'),
            //     'alamat' => $this->request->getPost('alamat'),
            //     'photo' => $imgName,
            // ]);
            // exit;

            $this->model->save([
                'name' => $this->request->getPost('name'),
                'nip' => $this->request->getPost('nip'),
                'jabatan' => $this->request->getPost('jabatan'),
                'alamat' => $this->request->getPost('alamat'),
                'photo' => $imgName,
            ]);
            if ($this->db->transStatus() === false) {
                if (
                    $imgName
                    && file_exists('uploads/'.$imgName)
                ) {
                    unlink('uploads/'.$imgName);
                }

                $this->db->transRollback();

                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Gagal menyimpan data',
                        'data' => null,
                    ]);
            }

            $this->db->transCommit();

            return $this->response->setStatusCode(201)->setJSON([
                'status' => true,
                'message' => 'Employee berhasil ditambahkan',
                'data' => null,
            ]);
        } catch (\Exception $e) {
            if (
                isset($imgName)
                && $imgName
                && file_exists('uploads/'.$imgName)
            ) {
                unlink('uploads/'.$imgName);
            }

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
    | UPDATE EMPLOYEE
    |--------------------------------------------------------------------------
    */

    public function update($id = null)
    {
        $rules = $this->validation->update();
        if (!$this->validate($rules)) {
            return $this->response->setStatusCode(422)->setJSON([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $this->validator->getErrors(),
                'data' => null,
            ]);
        }
        $this->db->transBegin();
        try {
            $employee = $this->model->find($id);

            if (!$employee) {
                return $this->response->setStatusCode(404)->setJSON([
                    'status' => false,
                    'message' => 'Employee tidak ditemukan',
                    'data' => null,
                ]);
            }

            $photoName = $employee['photo'];
            $photo = $this->request->getFile('foto');
            if ($photo && $photo->isValid()) {
                $newPhoto = $photo->getRandomName();
                $photo->move('uploads', $newPhoto);

                if (
                    !empty($employee['photo'])
                    && file_exists('uploads/'.$employee['photo'])
                ) {
                    unlink('uploads/'.$employee['photo']);
                }

                $photoName = $newPhoto;
            }

            $this->model->update($id, [
                'name' => $this->request->getPost('name'),
                'jabatan' => $this->request->getPost('jabatan'),
                'nip' => $this->request->getPost('nip'),
                'alamat' => $this->request->getPost('alamat'),
                'photo' => $photoName,
            ]);

            if ($this->db->transStatus() === false) {
                $this->db->transRollback();

                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Gagal ubah data',
                        'data' => null,
                    ]);
            }
            $this->db->transCommit();

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'Employee berhasil diupdate',
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
    | DELETE EMPLOYEE
    |--------------------------------------------------------------------------
    */

    public function delete($id = null)
    {
        $this->db->transBegin();
        try {
            $employee = $this->model->find($id);

            if (!$employee) {
                return $this->response->setStatusCode(404)->setJSON([
                    'status' => false,
                    'message' => 'Employee tidak ditemukan',
                    'data' => null,
                ]);
            }

            if (
                !empty($employee['photo'])
                && file_exists('uploads/'.$employee['photo'])
            ) {
                unlink('uploads/'.$employee['photo']);
            }

            $this->model->delete($id);

            if ($this->db->transStatus() === false) {
                $this->db->transRollback();

                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'status' => false,
                        'message' => 'Gagal hapus data',
                        'data' => null,
                    ]);
            }

            $this->db->transCommit();

            return $this->response->setStatusCode(200)->setJSON([
                'status' => true,
                'message' => 'Employee berhasil dihapus',
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
}
