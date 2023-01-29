local utils = require 'mp.utils'
require 'mp'

function log(string,secs)
	secs = secs or 2.5
	mp.msg.warn(string)
	mp.osd_message(string,secs)
end


local function download_subtitle()
    local filename = mp.get_property("path")
    local handleBasename = io.popen("basename "..filename)
    local basename = handleBasename:read("*a")
    handleBasename:close()
    local handle = io.popen("yifysub download "..basename)
    local result = handle:read("*a")
    handle:close()
  
    

    
    
    if result == "true" then
        log('subtitle download successfull')
    end
   
    mp.commandv('rescan_external_files', 'reselect')
    
    

end
mp.add_key_binding("g", "print-filename", download_subtitle)

