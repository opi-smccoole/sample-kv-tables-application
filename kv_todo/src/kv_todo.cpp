#include <kv_todo.hpp>

[[eosio::action]]
std::vector<todo_entry> kv_todo::getbyaccname(name account_name) {
   auto begin_uuid = todo_entries.uuid.begin().value().get_uuid();
   auto end_uuid = todo_entries.uuid.end().value().get_uuid();

   return todo_entries.account_name.range({begin_uuid, account_name}, {end_uuid, account_name});
}

[[eosio::action]]
todo_entry kv_todo::upsert(const std::string& uuid,
                           eosio::name account_name,
                           const std::string& task,
                           bool checked) {

   todo_entry todo_entry_update = {uuid, {uuid, account_name}, {uuid, task}, {uuid, checked}};

   // we will pay for the entry
   todo_entries.put(todo_entry_update, get_self());

   auto itr = todo_entries.uuid.find(uuid);
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
