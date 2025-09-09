<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Requests\ClientStoreRequest;
use App\Http\Requests\ClientUpdateRequest;

class ClientController extends Controller{
  public function index(Request $request){
    $per = (int)$request->query('per_page', 50);
    $q   = trim((string)$request->query('q', ''));

    $query = Client::query()->orderBy('name');

    if($q !== ''){
      $query->where(function ($w) use ($q) {
        $w->where('name','like',"%{$q}%")
          ->orWhere('email','like',"%{$q}%")
          ->orWhere('phone','like',"%{$q}%");
      });
    }

    $paginator = $query->paginate($per)->appends($request->query());

    return response()->json([
      'data' => $paginator->items(),
      'meta' => [
        'current_page' => $paginator->currentPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'last_page'    => $paginator->lastPage(),
      ],
    ]);
  }

  public function show(Client $client){
    return response()->json(['data' => $client]);
  }

  public function store(ClientStoreRequest $request){
    $payload = $request->validated();
    $payload['user_id'] = auth()->id();
    $client = Client::create($payload);

    return response()->json(['data' => $client], 201);
  }

  public function update(ClientUpdateRequest $request, Client $client){
    $client->update($request->validated());
    return response()->json(['data' => $client]);
  }

  public function destroy(Client $client){
    $client->delete();
    return response()->json(['data' => true]);
  }
}