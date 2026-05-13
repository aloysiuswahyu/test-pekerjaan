<?php

namespace App\Models;

use CodeIgniter\Model;

class EmployeeModel extends Model
{
    protected $table = 'employee';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'name',
        'nip',
        'jabatan',
        'alamat',
        'photo',
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // public function getEmployees()
    // {
    //     return $this->select('employees.*, positions.name as position_name')
    //         ->join('positions', 'positions.id = employees.position_id')
    //         ->findAll();
    // }

    // public function getEmployeeById($id)
    // {
    //     return $this->select('employees.*, positions.name as position_name')
    //         ->join('positions', 'positions.id = employees.position_id')
    //         ->where('employees.id', $id)
    //         ->first();
    // }
}
