# Call of Duty 2 - Masterserver Emulator # 

 This tool will emulate a call of duty 2 masterserver. 
 You just have to manipulate the executables of the game or redirect the connections from cod2master.activision.com to your server-ip.
 After this you'll also need to edit the host's file of your OS and redirect all server-traffic (cod2master.activision.com) to your emulated masterserver.
 For those who can reverse, just use an static Debugger / Dissassembler and edit all cod2master.activision.com domains to your server-ip.

### Features ###

* Receive informations of servers and add them to your own MS-List
* Logging any informations that server's will send you (safety)

### How to setup? ###

* Install NodeJS
* Setup the configuration-file (config.json)
* Portforward if you block the main-port "20710"
* Run as administrator on windows / set 777 rights for Linux

### Creators? ###

* Main-Developer: Grab