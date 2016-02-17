migration.up = function(migrator) {
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN data TEXT;');
};
migration.down = function(migrator) {
    // var db = migrator.db;
    // var table = migrator.table;
    // db.execute('CREATE TEMPORARY TABLE device_backup(title,author,alloy_id);')
    // db.execute('INSERT INTO book_backup SELECT title,author,alloy_id FROM ' + table + ';');
    // migrator.dropTable();
    // migrator.createTable({
        // columns: {
            // title:"TEXT",
            // author:"TEXT",
        // },
    // });
    // db.execute('INSERT INTO ' + table + ' SELECT title,author,alloy_id FROM book_backup;');
    // db.execute('DROP TABLE book_backup;');
};