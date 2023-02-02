local mp = require('mp')




function log(string, secs)
    secs = secs or 2.5
    mp.msg.warn(string)
    mp.osd_message(string, secs)
end

function showmenu()
    local opts = { "English", "Turkish", "German", "Dutch" }
    local args = {"zenity", "--list", "--text=Menu", "--column=Options"}
    for _, opt in ipairs(opts) do
        table.insert(args, opt)
    end
    local cmd = table.concat(args, " ")

    local pipe = io.popen(cmd, "r")
    local choice = pipe:read("*all")
    pipe:close()
    return choice

end

function download_subtitle()
    local language = string.lower(showmenu())
    local filename = mp.get_property("path")
    print("yifysub download " .. filename .. "-l " ..language)
    local handle = io.popen("yifysub download " .. filename .. " -l " ..language)
    if handle then
        local result = handle:read("*all")
        local last_line = string.match(result, "([^\n]+)$")
        handle:close()
        if last_line == "true" then
            log("Subtitle download successfull")
        else
            log("Subtitle not found! Look terminal for logging the issue")
            print(result)
        end
    end
    mp.commandv('rescan_external_files', 'reselect')
end

mp.add_key_binding('g', 'Download-a-subtitle', download_subtitle)


