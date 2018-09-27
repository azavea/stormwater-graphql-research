task default: %[build]

desc "Build project"
task :build do
  puts "Building project ->"
  sh "docker-compose build"
end

desc "Start GraphQL server"
task :server do
  trap("SIGINT") { puts "Stopping GraphQL server ->" }
  puts "Starting GraphQL server ->"
  sh "docker-compose up"
end

desc "Launch React Native client"
task :client do
  puts "Launching React Native client ->"
end
