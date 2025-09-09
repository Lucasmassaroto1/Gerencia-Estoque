<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientStoreRequest extends FormRequest{
  public function authorize(): bool{
    return true;
  }

  public function rules(): array{
    return[
      'name'  => ['required','string','max:255'],
      'email' => ['nullable','email','max:255'],
      'phone' => ['nullable','string','max:20'],
      'notes' => ['nullable','string'],
    ];
  }
}
