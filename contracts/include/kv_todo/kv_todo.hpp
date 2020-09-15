#include <eosio/eosio.hpp>
using namespace std;
using namespace eosio;

struct todo_entry {
  std::string uuid;
  eosio::non_unique<std::string, eosio::name> account_name;
  eosio::non_unique<std::string, std::string> task;
  eosio::non_unique<std::string, bool> checked;

  std::string get_uuid() const {
    return uuid;
  }
  eosio::name get_account_name() const {
    return get<1>(account_name);
  }
  std::string get_task() const {
    return get<1>(task);
  }
  bool get_checked() const {
    return get<1>(checked);
  }
};

struct todo_entry_factory {
  static todo_entry get_todo_entry(
    std::string uuid,
    eosio::name account_name,
    std::string task,
    bool checked) {
      return todo_entry {
        .uuid = uuid,
        .account_name = {uuid, account_name},
        .task = {uuid, task},
        .checked = {uuid, checked}
      };
    }
};

class [[eosio::contract]] kv_todo : public contract {
  struct [[eosio::table]] todo_table : eosio::kv::table<todo_entry, "kvtodo"_n> {
    KV_NAMED_INDEX("uuid"_n, uuid);
    KV_NAMED_INDEX("accname"_n, account_name);
    KV_NAMED_INDEX("task"_n, task)
    KV_NAMED_INDEX("checked"_n, checked)
    todo_table(eosio::name contract_name) {
         init(contract_name, uuid);
      }
  };
  public:
     using contract::contract;
     kv_todo(name receiver, name code, datastream<const char*> ds)
         : contract(receiver, code, ds) {}

      [[eosio::action]]
      std::vector<todo_entry> getbyaccname(name account_name);

      [[eosio::action]]
      todo_entry upsert(string uuid,
        eosio::name account_name,
        string task,
        bool checked);

      [[eosio::action]]
      void del(string uuid);

      using get_by_account_name_action = action_wrapper<"getbyaccname"_n, &kv_todo::getbyaccname>;
      using upsert_action = action_wrapper<"upsert"_n, &kv_todo::upsert>;
      using del_action = action_wrapper<"del"_n, &kv_todo::del>;
  
  private:
    todo_table todo_entries{"kvtodo"_n};
};
