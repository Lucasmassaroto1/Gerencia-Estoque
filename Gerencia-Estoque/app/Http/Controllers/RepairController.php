<?php

namespace App\Http\Controllers;

use App\Models\Repair;
use Illuminate\Http\Request;

class RepairController extends Controller{
  public function index(Request $request){
    $date = $request->query('date'); // YYYY-MM-DD
    $query = Repair::query()->with('client');

    if($date){
      $query->whereDate('created_at', $date);
    }

    $items = $query->orderByDesc('id')->get()->map(function($r){
      return[
        'id' => $r->id,
        'client' => optional($r->client)->name,
        'device' => $r->device,
        'status' => $r->status,
        'price' => $r->price ? (float)$r->price : null,
        'created_at' => $r->created_at,
      ];
    });

    return response()->json(['data' => $items]);
  }
}
