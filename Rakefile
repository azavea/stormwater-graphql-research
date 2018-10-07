task default: %[build]

desc "Build project"
task :build do
  puts "Building GraphQL server and React web containers ->"
  sh "docker-compose build"
  Dir.chdir("mobile") do
    puts "Installing React Native client dependencies ->"
    sh "npm install"
  end
end

desc "Start GraphQL server"
task :server do
  puts "Starting GraphQL server ->"
  sh "docker-compose up api redis-server"
end

desc "Launch React Native client"
task :mobile do
  puts "Launching React Native client ->"
  Dir.chdir("mobile") do
    system("npm start")
  end
end

desc "Start React/Leaflet web client"
task :web do
  puts "Launching React/Leaflet web client ->"
  sh "docker-compose up web"
end

desc "Start GraphQL server & web client"
task :start do
  puts "Starting GraphQL server & web client ->"
  sh "docker-compose up"
end
