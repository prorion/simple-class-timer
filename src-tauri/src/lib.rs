#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![quit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn quit(app: tauri::AppHandle) {
    app.exit(0);
}
