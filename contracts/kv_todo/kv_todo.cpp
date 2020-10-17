#include <kv_todo.hpp>

[[eosio::action]]
std::vector<todo_entry> kv_todo::getbyaccname(name account_name) {
   std::string min_uuid = "00000000-0000-0000-0000-000000000000";
   std::string max_uuid = "ffffffff-ffff-ffff-ffff-ffffffffffff";

   return todo_entries.account_name.range({min_uuid, account_name}, {max_uuid, account_name});
}

[[eosio::action]]
todo_entry kv_todo::upsert(const std::string& uuid,
                           eosio::name account_name,
                           const std::string& task,
                           bool checked) {

   require_auth(account_name);

   auto itr = todo_entries.uuid.find(uuid);
   if (itr != todo_entries.uuid.end()) {
      check(account_name == itr.value().get_account_name(), "Unauthorized");
      todo_entry todo_entry_update = {itr.value().get_uuid(), {uuid, itr.value().get_account_name()}, {uuid, task}, {uuid, checked}, {uuid, itr.value().get_created()}};
      todo_entries.put(todo_entry_update, get_self());
   } else {
      uint32_t created = eosio::current_time_point().sec_since_epoch();
      todo_entry todo_entry_insert = {uuid, {uuid, account_name}, {uuid, task}, {uuid, checked}, {uuid, created}};
      todo_entries.put(todo_entry_insert, get_self());
   }

   itr = todo_entries.uuid.find(uuid);
   return itr.value();
}

[[eosio::action]]
void kv_todo::del(const std::string& uuid) {
   auto itr = todo_entries.uuid.find(uuid);

   if (itr != todo_entries.uuid.end()) {
      todo_entries.erase(itr.value());
      eosio::print_f("todo_entry was successfully deleted from table.");
   } else {
      eosio::print_f("todo_entry not found in table.");
   }
}
