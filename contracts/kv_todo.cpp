#include <kv_todo/kv_todo.hpp>

[[eosio::action]]
std::vector<todo_entry> kv_todo::getbyaccname(name account_name) {
   todo_table todo_entries{"kvtodo"_n};

   auto begin_uuid = todo_entries.uuid.begin().value().get_uuid();
   auto end_uuid = todo_entries.uuid.end().value().get_uuid();

   auto list_of_todo_entries = todo_entries.account_name.range(
      {begin_uuid, account_name},
      {end_uuid, account_name});
   return list_of_todo_entries;
}

[[eosio::action]]
todo_entry kv_todo::upsert(string uuid,
      eosio::name account_name,
      string task,
      bool checked) {
   todo_table todo_entries{"kvtodo"_n};

   const todo_entry& todo_entry_update = todo_entry_factory::get_todo_entry(uuid,
      account_name,
      task,
      checked);

   todo_entries.put(todo_entry_update, get_self());

   auto itr = todo_entries.uuid.find(uuid);
   const auto& todo_entry = itr.value();
   return todo_entry;
}

[[eosio::action]]
void kv_todo::del(string uuid) {
   todo_table todo_entries{"kvtodo"_n};
   auto itr = todo_entries.uuid.find(uuid);

   if (itr != todo_entries.uuid.end()) {
      const auto& todo_entry_found = itr.value();
      todo_entries.erase(todo_entry_found);
      eosio::print_f("todo_entry was successfully deleted from table.");
   } else {
      eosio::print_f("todo_entry not found in table.");
   }
}
